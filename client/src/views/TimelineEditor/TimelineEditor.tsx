import { Button, WithModal } from '@guardian/threads';
import React, { FC, useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { Timeline } from '../../components/Timeline/Timeline';
import {
	MultiPanelPage,
	PanelData,
} from '../../layout/MultiPanelPage/MultiPanelPage';
import { NewPanelModal } from './NewPanelModal';

type TimelineEditorProps = {
	title: string;
};

export const TimelineEditor: FC<TimelineEditorProps> = ({ title }) => {
	const [panels, setPanels] = useState([
		{
			id: 'timeline',
			title: 'Timeline with an extremely long name whats going on',
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
