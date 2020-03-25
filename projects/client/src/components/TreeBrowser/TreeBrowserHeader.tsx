import { Button, MenuItem, Switch, WithDropdownMenu } from '@guardian/threads';
import { LocationDescriptor } from 'history';
import React, { FC, ReactNode } from 'react';
import { MdViewColumn } from 'react-icons/md';
import { ColumnConfig } from './TreeBrowser';
import styles from './TreeBrowserHeader.module.css';

type BreadcrumbPart = {
	text: string;
	to: LocationDescriptor;
};

type TreeBrowserHeaderProps = {
	breadcrumbs: BreadcrumbPart[];
	controls?: ReactNode;
	columnConfig: ColumnConfig;
	visibleColumns: string[];
	setVisibleColumns: (visibleColumns: string[]) => void;
};

export const TreeBrowserHeader: FC<TreeBrowserHeaderProps> = ({
	breadcrumbs,
	controls,
	columnConfig,
	visibleColumns,
	setVisibleColumns,
}) => {
	return (
		<div className={styles.toolbar}>
			<div className={styles.breadcrumbs}>
				{breadcrumbs.map(crumb => (
					<React.Fragment key={crumb.text}>
						<Button to={crumb.to} appearance="transparent">
							{crumb.text}/
						</Button>
					</React.Fragment>
				))}
			</div>
			<div>
				{!!controls && controls}
				<WithDropdownMenu
					persistent
					proxy={
						<Button appearance="toolset" icon={<MdViewColumn />} isDropdown />
					}
				>
					{columnConfig.columns.map(c => (
						<MenuItem
							key={c.name}
							label={c.name}
							htmlFor={c.name}
							control={
								<Switch
									id={c.name}
									checked={visibleColumns.some(col => col === c.name)}
									onChange={checked => {
										console.log(c.name);
										if (checked) {
											setVisibleColumns([...visibleColumns, c.name]);
										} else {
											setVisibleColumns(
												visibleColumns.filter(col => col !== c.name)
											);
										}
									}}
								/>
							}
						/>
					))}
				</WithDropdownMenu>
			</div>
		</div>
	);
};
