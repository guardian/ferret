import {
	Button,
	Form,
	FormRow,
	MenuItem,
	Panel,
	WithDropdownMenu,
} from '@guardian/threads';
import React, { FC, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import uuidv4 from 'uuid';

type NewPanelModalProp = {
	onSubmit: () => void;
};

export const NewPanelModal: FC<NewPanelModalProp> = ({ onSubmit }) => {
	const [panelType, setPanelType] = useState(undefined);
	const [title, setTitle] = useState('New Panel');

	const menu = (
		<WithDropdownMenu
			proxy={<Button appearance="transparent" icon={<MdMenu />} />}
		>
			<MenuItem label="Remove" />
		</WithDropdownMenu>
	);
	const submit = () => {
		//onSubmit({ id: uuidv4(), width: 500, title, menu });
	};

	return (
		<Panel title="New Panel">
			<Form onSubmit={submit}>
				<FormRow title="Type">
					<select>
						<optgroup label="Visualisation">
							<option value="map">Map</option>
						</optgroup>
						<optgroup label="Feeds">
							<option value="grid::borisjohnson">
								Grid Tracker: Boris Johnson
							</option>
							<option value="grid::jeremycorbyn">
								Grid Tracker: jeremy Corbyn
							</option>
						</optgroup>
					</select>
				</FormRow>
				<FormRow horizontal>
					<Button type="submit" disabled={false}>
						Add
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
