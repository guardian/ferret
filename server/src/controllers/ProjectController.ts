import { ProjectAccessLevel } from '@guardian/ferret-common';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { postProjectFormValidators } from '../model/forms/PostProjectForm';
import { postTimelineEntryFormValidators } from '../model/forms/PostTimelineEntryForm';
import { postTimelineFormValidators } from '../model/forms/PostTimelineForm';
import { putReorderTimelineEntriesFormValidators } from '../model/forms/PutReorderTimelineEntriesForm';
import { Database } from '../services/Database';
import {
	checkLoginAuth,
	checkProjectPermissions,
	checkUserPermissions,
	getUser,
	handleFailure,
} from './helpers';

export class ProjectsController {
	db: Database;

	constructor(db: Database) {
		this.db = db;
	}

	listProjects = () => [
		checkLoginAuth,
		(req: Request, res: Response) => {
			const user = getUser(req);
			this.db.projectQueries
				.listProjects(user.id)
				.then(projects => {
					res.json(projects);
				})
				.catch(err => handleFailure(res, err, 'Failed to list projects'));
		},
	];

	insertProject = () => {
		return [
			checkLoginAuth,
			checkUserPermissions('manage_projects'),
			postProjectFormValidators,
			async (req: Request, res: Response) => {
				const errors = validationResult(req);

				if (!errors.isEmpty()) {
					return res.status(422).json({
						message: 'Invalid create project request',
						errors: errors.array(),
					});
				}

				const { title, image } = req.body;

				const user = getUser(req);
				this.db.projectQueries
					.insertProject(title, image, user.id)
					.then(() => res.status(201).send())
					.catch(err => handleFailure(res, err, 'Failed to insert project'));
			},
		];
	};

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
				.insertTimeline(user.id, req.params.pId, req.body.title, req.body.image)
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
