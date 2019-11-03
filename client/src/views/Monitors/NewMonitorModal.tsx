import React, { FC, useState } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createMonitor } from '../../services/monitors';

type NewMonitorModalProps = {
	onSuccess: () => void;
	onError: () => void;
};

export const NewMonitorModal: FC<NewMonitorModalProps> = ({
	onSuccess,
	onError,
}) => {
	const [name, setName] = useState('');
	const [monitorType, setMonitorType] = useState(undefined as
		| string
		| undefined);
	const [query, setQuery] = useState('');

	const renderFields = () => {
		switch (monitorType) {
			case 'grid':
			case 'twitter':
				return (
					<FormRow title="Query">
						<input
							type="text"
							placeholder="Enter query..."
							value={query}
							onChange={e => setQuery(e.target.value)}
						/>
					</FormRow>
				);
			default:
				return <div>Select a monitor type</div>;
		}
	};

	return (
		<Panel title="Add Monitor">
			<Form
				onSubmit={() => {
					if (monitorType === 'grid' || monitorType === 'twitter') {
						createMonitor(name, monitorType, query)
							.then(onSuccess)
							.catch(onError);
					} else {
						alert('unknown type: ' + monitorType);
					}
				}}
			>
				<FormRow title="Name">
					<input
						type="text"
						placeholder="Enter name..."
						autoFocus
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Type">
					<select
						value={monitorType}
						onChange={e => setMonitorType(e.target.value)}
					>
						<option>Select type</option>
						<option value="grid">Grid</option>
						<option value="twitter">Twitter</option>
					</select>
				</FormRow>
				{renderFields()}
				<FormRow horizontal>
					<Button type="submit" disabled={!name || !monitorType || !query}>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
