import { Button, Form, FormRow, Panel } from '@guardian/threads';
import React, { FC } from 'react';
import { ProjectPanelType } from './Project';
import uuidv4 from 'uuid';

type NewPanelModalProps = {
	onConfirm: (id: string, type: ProjectPanelType) => void;
	onCancel: () => void;
};

export const NewPanelModal: FC<NewPanelModalProps> = ({
	onConfirm,
	onCancel,
}) => {
	return (
		<Panel title={'New Panel'}>
			<Form onSubmit={() => {}}>
				<FormRow>
					<Button
						appearance="important"
						onClick={() => onConfirm(uuidv4(), 'filebrowser')}
					>
						File Browser
					</Button>
				</FormRow>
				<FormRow>
					<Button
						appearance="important"
						onClick={() => onConfirm(uuidv4(), 'workspace')}
					>
						Workspace
					</Button>
				</FormRow>
				<FormRow horizontal>
					<Button appearance="default" onClick={onCancel}>
						Cancel
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
