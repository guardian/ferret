import React, { FC } from 'react';
import { MultiPanel } from '../../layout/MultiPanelPage/MultiPanelPage';
import { Workspace } from '../../layout/Workspace/Workspace';

type ProjectWorkspacePanelProps = {
	panelId: string;
	onClosePanel: (id: string) => void;
};

export const ProjectWorkspacePanel: FC<ProjectWorkspacePanelProps> = ({
	panelId,
	onClosePanel,
}) => {
	return (
		<MultiPanel id={panelId} initialWidth={400} onClosePanel={onClosePanel}>
			<Workspace />
		</MultiPanel>
	);
};
