import React, { FC, useEffect, useState } from 'react';
import { CenteredPage, WithModal, Button } from '@guardian/threads';
import { match } from 'react-router';
import { getDataset } from '../../services/datasets';
import { Dataset as DatasetT, DatasetType } from '@guardian/ferret-common';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { UploadFilesModal } from './UploadFilesModal';

type DatasetProps = {
	match: match<{ dId: string }>;
};

export const Dataset: FC<DatasetProps> = ({ match }) => {
	const [uploadOpen, setUploadOpen] = useState(false);
	const [dataset, setDataset] = useState(undefined as DatasetT | undefined);

	useEffect(() => {
		getDataset(match.params.dId)
			.then(p => setDataset(p))
			.catch(e => console.error(e));
	}, []);

	const renderTypeInfo = (type: DatasetType) => {
		if (dataset) {
			switch (type) {
				case 'empty':
					return (
						<div>
							<WithModal
								isOpen={uploadOpen}
								setIsOpen={setUploadOpen}
								proxy={<Button appearance="important">Upload Documents</Button>}
							>
								<UploadFilesModal
									dId={dataset.id}
									onSuccess={() => {}}
									onError={() => {}}
								/>
							</WithModal>
						</div>
					);
				default:
					return <div>Unhandled dataset type: {type} </div>;
			}
		}
	};

	if (!dataset) {
		// TODO make a pretty page <3
		return null;
	} else {
		return (
			<CenteredPage>
				<h1>{dataset.title}</h1>
				<ControlBox>{renderTypeInfo(dataset.type)}</ControlBox>
			</CenteredPage>
		);
	}
};
