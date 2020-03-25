import { Button, Form, FormRow, Panel } from '@guardian/threads';
import React, { FC } from 'react';

type ConfirmModalProps = {
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export const ConfirmModal: FC<ConfirmModalProps> = ({
	title,
	onConfirm,
	onCancel,
}) => {
	return (
		<Panel title={title}>
			<Form onSubmit={() => {}}>
				<FormRow horizontal>
					<Button appearance="default" onClick={onCancel}>
						Cancel
					</Button>
					<Button appearance="important" onClick={onConfirm}>
						Confirm
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
