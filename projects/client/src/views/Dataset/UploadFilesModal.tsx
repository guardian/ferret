import { Button, Form, FormRow, Panel } from '@guardian/threads';
import React, { ChangeEventHandler, FC, useState } from 'react';
import { uploadFiles } from '../../services/datasets';
import { DirectoryInput } from './DirectoryInput';

type NewProjectModalProps = {
	dId: string;
	onSuccess: () => void;
	onError: () => void;
};

export const UploadFilesModal: FC<NewProjectModalProps> = ({
	dId,
	onSuccess,
	onError,
}) => {
	const [processing, setProcessing] = useState(false);
	const [currentFiles, setCurrentFiles] = useState(
		undefined as any | undefined
	);

	const onChangeDirectory: ChangeEventHandler<HTMLInputElement> = e => {
		const { files } = e.target;

		if (files && files.length > 0) {
			setCurrentFiles(files);
		} else {
			setCurrentFiles(undefined);
		}
	};

	const beginUpload = async () => {
		setProcessing(true);
		await uploadFiles(dId, currentFiles);
		setProcessing(false);
	};

	return (
		<Panel title="Upload Files">
			<Form onSubmit={() => beginUpload()}>
				<FormRow title="Directory">
					<DirectoryInput onChange={onChangeDirectory} />
				</FormRow>
				<FormRow horizontal>
					<Button
						type="submit"
						disabled={!currentFiles || processing}
						showSpinner={processing}
					>
						Upload
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
