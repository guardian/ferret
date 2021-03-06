import { Timeline as TimelineType } from '@guardian/ferret-common';
import { Button, WithModal } from '@guardian/threads';
import React, { FC, useEffect, useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { match } from 'react-router';
import { TimelineEntriesEditor } from './TimelineEntriesEditor';
import { MultiPanelPage } from '../../layout/MultiPanelPage/MultiPanelPage';
import { getTimelines } from '../../services/project';
import { NewPanelModal } from './NewPanelModal';

type TimelineEditorProps = {
	match: match<{ pId: string; tId: string }>;
};

// ---------------------------------------------------
// -- Deprecated in favor of the project panel view --
// ---------------------------------------------------

export const TimelineEditor = () => {
	return <div>deprecated</div>;
};
/*
export const TimelineEditor: FC<TimelineEditorProps> = ({ match }) => {
	const [panels, setPanels] = useState([] as PanelData[]);

	useEffect(() => {
		getTimelines(match.params.pId)
			.then((timelines: TimelineType[]) => {
				const tl = timelines.find(t => t.id === match.params.tId);
				if (tl) {
					setPanels([
						{
							id: 'timeline',
							title: tl.title,
							width: 800,
							children: (
								<TimelineEntriesEditor
									pId={match.params.pId}
									tId={match.params.tId}
								/>
							),
						},
						...panels,
					]);
				} else {
					alert(`Could not find timeline with id '${match.params.tId}'`);
				}
			})
			.catch(e => console.error(e));
	}, [match.params.tId]);

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
			<MultiPanelPage
				onResizePanel={onResizePanel}
				panels={panels}
				onClosePanel={() => {}}
			/>
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
					proxy={<Button icon={<MdAddCircle />} />}
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

*/
