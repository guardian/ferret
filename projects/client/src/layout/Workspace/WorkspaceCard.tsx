import React, { FC, ReactNode } from 'react';
import { Card } from '@guardian/threads';

type WorkspaceCardProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	title: string;
	children: ReactNode;
};

export const WorkspaceCard: FC<WorkspaceCardProps> = ({
	x,
	y,
	width,
	height,
	title,
	children,
}) => {
	return (
		<div style={{ position: 'absolute', left: x + 'px', top: y + 'px' }}>
			<Card title={title} onDelete={() => {}}>
				<div style={{ width: width + 'px', height: height + 'px' }}>
					{children}
				</div>
			</Card>
		</div>
	);
};
