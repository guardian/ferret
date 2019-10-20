import React from 'react';
import {
	CenteredPage,
	WithDropdownMenu,
	Button,
	MenuItem,
	FormRow,
} from '@guardian/threads';
import { MdBrush } from 'react-icons/md';

export const Settings = () => {
	return (
		<CenteredPage>
			<h1>Settings</h1>
			<FormRow horizontal>
				<h2>Theme</h2>
				<WithDropdownMenu
					proxy={() => (
						<Button appearance="toolset" isDropdown icon={<MdBrush />}>
							Theme
						</Button>
					)}
				>
					<MenuItem
						onClick={() => (document.documentElement.dataset.theme = 'aero')}
						label="Aero"
					/>
					<MenuItem
						onClick={() => (document.documentElement.dataset.theme = 'pastel')}
						label="Pastel"
					/>
					<MenuItem disabled onClick={() => {}} label="Goth" />
				</WithDropdownMenu>
			</FormRow>
		</CenteredPage>
	);
};
