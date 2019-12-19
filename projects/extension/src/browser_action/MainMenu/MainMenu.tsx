import { Menu, MenuItem, MenuSeparator } from '@guardian/threads';
import React from 'react';
import { FaFacebookSquare } from 'react-icons/fa';
import { GiSpiderWeb } from 'react-icons/gi';
import { MdArrowForward, MdSettings } from 'react-icons/md';
import { FacebookScraper } from '../Scrapers/FacebookScraper';
import { setView, useAppState } from '../state/AppState';

export const MainMenu = () => {
	const [{ view }, dispatch] = useAppState();
	if (view === 'main') {
		return (
			<Menu>
				<MenuItem
					label="Scrape"
					icon={<GiSpiderWeb />}
					onClick={() => dispatch(setView('scrape', 'main'))}
					control={<MdArrowForward />}
				/>
				<MenuItem
					label="Settings"
					icon={<MdSettings />}
					control={<MdArrowForward />}
				/>
				<MenuSeparator />
				<MenuItem label="Logout" />
			</Menu>
		);
	} else if (view === 'scrape') {
		return (
			<Menu>
				<MenuItem
					label="Facebook Profile"
					icon={<FaFacebookSquare />}
					onClick={() => dispatch(setView('scrape::facebook', 'scrape'))}
				/>
			</Menu>
		);
	} else if (view === 'scrape::facebook') {
		return <FacebookScraper />;
	} else {
		return <div>Unknown view {view}</div>;
	}
};
