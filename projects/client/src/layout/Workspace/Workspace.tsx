import React, { FC } from 'react';
import styles from './Workspace.module.css';
import { WorkspaceCard } from './WorkspaceCard';

type WorkspaceProps = {};

export const Workspace: FC<WorkspaceProps> = () => {
	return (
		<div className={styles.container}>
			<WorkspaceCard title="Test card" x={10} y={10} width={200} height={300}>
				This is a test card
			</WorkspaceCard>
		</div>
	);
};
