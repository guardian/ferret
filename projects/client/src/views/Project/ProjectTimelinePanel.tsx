import React, { FC } from 'react';
import { MultiPanel } from '../../layout/MultiPanelPage/MultiPanelPage';
import { TimelineEntriesEditor } from '../TimelineEditor/TimelineEntriesEditor';

type ProjectTimelinePanelProps = {
	panelId: string;
	projectId: string;
	timelineId: string;
	onClosePanel: (id: string) => void;
};

export const ProjectTimelinePanel: FC<ProjectTimelinePanelProps> = ({
	panelId,
	onClosePanel,
	projectId,
	timelineId,
}) => {
	return (
		<MultiPanel id={panelId} initialWidth={400} onClosePanel={onClosePanel}>
			<TimelineEntriesEditor pId={projectId} tId={timelineId} />
		</MultiPanel>
	);
};
