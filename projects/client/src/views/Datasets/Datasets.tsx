import { Button, CenteredPage, WithModal } from '@guardian/threads';
import React, { useEffect, useState } from 'react';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { GridBox } from '../../components/GridBox/GridBox';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { history } from '../../index';
import { getDatasets } from '../../services/datasets';
import { NewDatasetModal } from './NewDatasetModal';

export const Datasets = () => {
	const [datasets, setDatasets] = useState([] as any[]);
	const [filter, setFilter] = useState('');

	useEffect(() => {
		getDatasets()
			.then(d => setDatasets(d))
			.catch(e => console.error(e));
	}, []);

	const [createModalOpen, setCreateModalOpen] = useState(false);

	return (
		<CenteredPage>
			<h1>Datasets</h1>
			<ControlBox>
				<input
					placeholder="Filter datasets..."
					onChange={e => setFilter(e.target.value)}
				/>
				<WithModal
					proxy={<Button>New Dataset</Button>}
					isOpen={createModalOpen}
					setIsOpen={setCreateModalOpen}
				>
					<NewDatasetModal
						onSuccess={() => {
							setCreateModalOpen(false);
							getDatasets()
								.then(d => setDatasets(d))
								.catch(e => console.error(e));
						}}
						onError={() => alert('Failed to create dataset')}
					/>
				</WithModal>
			</ControlBox>
			<GridBox emptyMessage="No datasets...">
				{datasets
					.filter(d => d.title.toLowerCase().startsWith(filter.toLowerCase()))
					.map(d => (
						<MenuCard
							key={d.id}
							title={d.title}
							onClick={() => history.push(`/datasets/${d.id}`)}
							backgroundImage={d.image}
						/>
					))}
			</GridBox>
		</CenteredPage>
	);
};
