import { Request, Response } from 'express';
import {
	checkProjectPermissions,
	checkLoginAuth,
	handleFailure,
	getUser,
} from '../helpers';
import { Database } from '../../services/Database';
import { postTimelineFormValidators } from '../../model/forms/PostTimelineForm';
import { postTimelineEntryFormValidators } from '../../model/forms/PostTimelineEntryForm';
import { putReorderTimelineEntriesFormValidators } from '../../model/forms/PutReorderTimelineEntriesForm';

export class TimelineController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listTimelines = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'read'),
		(req: Request, res: Response) => {
			this.db.projectQueries
				.listTimelines(req.params.pId)
				.then(timelines => {
					res.json(timelines);
				})
				.catch(err => handleFailure(res, err, 'Failed to list timelines'));
		},
	];

	insertTimeline = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'write'),
		postTimelineFormValidators,
		(req: Request, res: Response) => {
			const user = getUser(req);

			this.db.projectQueries
				.insertTimeline(user.id, req.params.pId, req.body.title)
				.then(() => res.status(201).send())
				.catch(err => handleFailure(res, err, 'Failed to insert timeline'));
		},
	];

	getTimelineEntries = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'read'),
		(req: Request, res: Response) => {
			this.db.projectQueries
				.listTimelineEntries(req.params.tId)
				.then(entries => res.send(entries))
				.catch(err =>
					handleFailure(res, err, 'Failed to get timeline entries')
				);
		},
	];

	postTimelineEntry = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'write'),
		postTimelineEntryFormValidators,
		(req: Request, res: Response) => {
			const { title, description, evidence } = req.body;

			this.db.projectQueries
				.insertTimelineEntry(req.params.tId, title, description, evidence)
				.then(() => res.status(201).send())
				.catch(err =>
					handleFailure(res, err, 'Failed to insert timeline entry')
				);
		},
	];

	reorderTimelineEntries = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'write'),
		putReorderTimelineEntriesFormValidators,
		(req: Request, res: Response) => {
			this.db.projectQueries
				.reorderTimelineEntries(req.body.ids)
				.then(() => res.status(200).send())
				.catch(err =>
					handleFailure(res, err, 'Failed to update timeline entry')
				);
		},
	];

	putTimelineEntry = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'write'),
		postTimelineEntryFormValidators,
		(req: Request, res: Response) => {
			const { eId } = req.params;
			const { happenedOn, title, description } = req.body;

			this.db.projectQueries
				.updateTimelineEntry(eId, happenedOn, title, description)
				.then(() => res.status(204).send())
				.catch(err =>
					handleFailure(res, err, 'Failed to update timeline entry')
				);
		},
	];

	deleteTimelineEntry = () => [
		checkLoginAuth,
		checkProjectPermissions(this.db, 'write'),
		(req: Request, res: Response) => {
			const { eId } = req.params;

			this.db.projectQueries
				.deleteTimelineEntry(eId)
				.then(() => res.status(204).send())
				.catch(err =>
					handleFailure(res, err, 'Failed to delete timeline entry')
				);
		},
	];
}
