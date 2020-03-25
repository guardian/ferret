import React, { FC, useState } from 'react';
import { match } from 'react-router';
import { MultiPanelPage } from '../../layout/MultiPanelPage/MultiPanelPage';
import { useProjectsState } from '../../state/ProjectsState';
import { ProjectFileBrowserPanel } from './ProjectFileBrowserPanel';
import { WithModal, Button } from '@guardian/threads';
import { NewPanelModal } from './NewPanelModal';
import { Workspace } from '../../layout/Workspace/Workspace';
import { ProjectWorkspacePanel } from './ProjectWorkspacePanel';
import { ProjectTimelinePanel } from './ProjectTimelinePanel';

export type ProjectPanelType = 'filebrowser' | 'workspace' | 'timeline';

type ProjectPanel = {
	id: string;
	type: ProjectPanelType;
};

type ProjectProps = {
	match: match<{ pId: string }>;
};

export const Project: FC<ProjectProps> = ({ match }) => {
	const [projects] = useProjectsState();

	const project = projects.find(p => p.id === match.params.pId)!;

	const [newPanelModalOpen, setNewPanelModalOpen] = useState(false);

	const [panels, setPanels] = useState([
		{ type: 'filebrowser', id: 'default-fileview' },
	] as ProjectPanel[]);

	const addPanel = (id: string, type: ProjectPanelType) => {
		setPanels([...panels, { id, type }]);
	};
	const closePanel = (id: string) => {
		setPanels(() => panels.filter(p => p.id != id));
	};

	if (project) {
		return (
			<MultiPanelPage
				fab={
					<WithModal
						isOpen={newPanelModalOpen}
						setIsOpen={setNewPanelModalOpen}
						proxy={<Button>Feelin' FAB!</Button>}
					>
						<NewPanelModal
							onConfirm={(id, type) => {
								addPanel(id, type);
								setNewPanelModalOpen(false);
							}}
							onCancel={() => setNewPanelModalOpen(false)}
						/>
					</WithModal>
				}
			>
				{panels.map(p => {
					if (p.type === 'filebrowser') {
						return (
							<ProjectFileBrowserPanel
								panelId={p.id}
								project={project}
								onClosePanel={closePanel}
							/>
						);
					} else if (p.type === 'workspace') {
						return (
							<ProjectWorkspacePanel panelId={p.id} onClosePanel={closePanel} />
						);
					} else if (p.type === 'timeline') {
						return (
							<ProjectTimelinePanel
								panelId={p.id}
								onClosePanel={closePanel}
								projectId={project.id}
								timelineId={''}
							/>
						);
					} else {
						return <div>Unknown panel type: {p.type}</div>;
					}
				})}
			</MultiPanelPage>
		);
	} else {
		return null;
	}
};
