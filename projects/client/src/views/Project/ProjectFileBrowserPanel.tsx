import React, { FC, useState } from 'react';
import hdate from 'human-date';
import { NewTitledThingModal } from '../../components/NewTitledThingModal/NewTitledThingModal';
import {
	Button,
	MenuItem,
	MenuSeparator,
	Modal,
	WithDropdownMenu,
} from '@guardian/threads';
import { TreeBrowser } from '../../components/TreeBrowser/TreeBrowser';
import { TreeBrowserHeader } from '../../components/TreeBrowser/TreeBrowserHeader';
import { Project as ProjectType } from '@guardian/ferret-common';
import {
	MdAccessTime,
	MdFileUpload,
	MdFolder,
	MdFormatAlignJustify,
	MdLibraryAdd,
} from 'react-icons/md';
import { MultiPanel } from '../../layout/MultiPanelPage/MultiPanelPage';
import { createTimeline } from '../../services/project';

type ProjectFileBrowserPanelProps = {
	panelId: string;
	project: ProjectType;
	onClosePanel: (id: string) => void;
};

export const ProjectFileBrowserPanel: FC<ProjectFileBrowserPanelProps> = ({
	panelId,
	project,
	onClosePanel,
}) => {
	// Modals
	const [tableModalOpen, setTableModalOpen] = useState(false);
	const [timelineModalOpen, setTimelineModalOpen] = useState(false);

	// Columns
	const [visibleColumns, setVisibleColumns] = useState([
		'Name',
		'Date Created',
	]);

	const columnConfig = {
		columns: [
			{
				name: 'Date Modified',
				field: 'dateModified',
				renderFn: (v: number) =>
					hdate.prettyPrint(new Date(Number(v)), {
						showTime: true,
					}) as string,
				sortFn: (a: number, b: number) => a - b,
			},
			{
				name: 'Date Created',
				field: 'dateCreated',
				renderFn: (v: number) =>
					hdate.prettyPrint(new Date(Number(v)), {
						showTime: true,
					}) as string,
				sortFn: (a: number, b: number) => a - b,
			},
		],
		sortColumn: 'Name',
		sortAscending: false,
	};

	const fileViewMenu = (
		<TreeBrowserHeader
			visibleColumns={visibleColumns}
			setVisibleColumns={setVisibleColumns}
			columnConfig={columnConfig}
			breadcrumbs={[{ text: project.title, to: '' }]}
			controls={
				<WithDropdownMenu
					proxy={
						<Button appearance="toolset" icon={<MdLibraryAdd />} isDropdown />
					}
				>
					<MenuItem icon={<MdFileUpload />} label="Upload" onClick={() => {}} />
					<MenuSeparator />
					<MenuItem icon={<MdFolder />} label="Directory" onClick={() => {}} />
					<MenuItem
						icon={<MdFormatAlignJustify />}
						label="Stuctured Table"
						onClick={() => setTableModalOpen(true)}
					/>
					<MenuItem
						icon={<MdAccessTime />}
						label="Timeline"
						onClick={() => setTimelineModalOpen(true)}
					/>
				</WithDropdownMenu>
			}
		/>
	);

	const fileViewPanel = (
		<TreeBrowser
			visibleColumns={visibleColumns}
			entries={[]}
			columnConfig={columnConfig}
			iconMap={{ folder: <MdFolder /> }}
		/>
	);

	return (
		<React.Fragment>
			<MultiPanel
				key={panelId}
				id={panelId}
				initialWidth={400}
				onClosePanel={onClosePanel}
				menu={fileViewMenu}
			>
				{fileViewPanel}
			</MultiPanel>
			{timelineModalOpen && (
				<Modal onClose={() => setTimelineModalOpen(false)}>
					<NewTitledThingModal
						title="New Timeline"
						onSubmit={async (name: string) => {
							await createTimeline(project.id, name);
						}}
						onSuccess={() => {
							setTimelineModalOpen(false);
							// Refresh dataset view
						}}
						onError={() => alert('Failed to create timeline')}
					/>
				</Modal>
			)}
			{tableModalOpen && (
				<Modal onClose={() => setTableModalOpen(false)}>
					<NewTitledThingModal
						title="New Structured Table"
						onSubmit={async () => {}}
						onSuccess={() => {
							// Refresh dataset view
						}}
						onError={() => alert('Failed to create timeline')}
					/>
				</Modal>
			)}
		</React.Fragment>
	);
};
