import { Button, Form, FormRow, Panel } from '@guardian/threads';
import React, { FC, useState } from 'react';
import { CenterBox } from '../CenterBox/CenterBox';
import { ImagePicker } from '../ImagePicker/ImagePicker';
import { MenuCard } from '../MenuCard/MenuCard';
import { createTimeline } from '../../services/project';

type NewTimelineModalProps = {
	title: string;
	onSubmit: (title: string) => Promise<void>;
	onSuccess: () => void;
	onError: () => void;
};
export const NewTitledThingModal: FC<NewTimelineModalProps> = ({
	title,
	onSubmit,
	onSuccess,
	onError,
}) => {
	const [processing, setProcessing] = useState(false);
	const [name, setName] = useState('');

	return (
		<Panel title={title}>
			<Form
				onSubmit={() => {
					setProcessing(true);
					onSubmit(name)
						.then(() => {
							setProcessing(false);
							onSuccess();
						})
						.catch(() => {
							setProcessing(false);
							onError();
						});
				}}
			>
				<FormRow title="Name">
					<input
						type="text"
						autoFocus
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</FormRow>
				<FormRow horizontal>
					<Button
						type="submit"
						disabled={!name || processing}
						showSpinner={processing}
					>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
