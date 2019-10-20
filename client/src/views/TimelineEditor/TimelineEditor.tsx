import React, { useState, ReactNode, FC } from 'react';
import {
	MultiPanelPage,
	PanelData,
} from '../../layout/MultiPanelPage/MultiPanelPage';
import {
	MenuItem,
	Menu,
	WithDropdownMenu,
	Button,
	WithModal,
} from '@guardian/threads';
import { Timeline } from '../../components/Timeline/Timeline';
import { MdMenu, MdAddCircle } from 'react-icons/md';
import { NewMonitorModal } from '../Monitors/NewMonitorModal';
import { NewPanelModal } from './NewPanelModal';

type TimelineEditorProps = {
	title: string;
};

export const TimelineEditor: FC<TimelineEditorProps> = ({ title }) => {
	const [panels, setPanels] = useState([
		{
			id: 'timeline',
			title: 'Timeline ',
			width: 500,
			children: <Timeline />,
		},
	] as PanelData[]);

	// TODO replace with function that gets data from the server
	const onResizePanel = (id: string, width: number) => {
		const newPanels = [...panels];
		const idPanel = newPanels.find(p => p.id === id);
		if (idPanel) {
			idPanel.width = width;
		}

		setPanels(newPanels);
	};

	const removePanel = (id: string) => {
		const newPanels = panels.filter(p => p.id !== id);
		setPanels(newPanels);
	};

	const [modalOpen, setModalOpen] = useState(false);
	return (
		<React.Fragment>
			<MultiPanelPage onResizePanel={onResizePanel} panels={panels} />
			<div
				style={{
					position: 'fixed',
					bottom: 'var(--sp-base)',
					right: 'var(--sp-base)',
				}}
			>
				<WithModal
					isOpen={modalOpen}
					setIsOpen={setModalOpen}
					proxy={() => <Button icon={<MdAddCircle />} />}
				>
					<NewPanelModal
						onSubmit={panel => {
							setPanels([...panels, panel]);
							setModalOpen(false);
						}}
					/>
				</WithModal>
			</div>
		</React.Fragment>
	);
};
