import React from 'react';
import { render } from 'react-dom';
import { Overlay } from './components/Overlay';
import { getEntity, getSources } from './entity-integration';
import './main.module.css';
import { OverlayPoint, SourceConfig } from './types';

const getOverlays = async (
	source: SourceConfig,
	id: string
): Promise<OverlayPoint[]> => {
	try {
		const elements: Element[] = source.dragQuerySelectors
			.map(q => Array.from(document.querySelectorAll(q)))
			.reduce((acc, curr) => acc.concat(curr), []);

		console.log('got ', source);
		const data = await getEntity('http://localhost:9999', source.name, id);

		return elements.map(e => ({
			rect: e.getBoundingClientRect(),
			entityData: data,
		}));
	} catch (e) {
		console.error('Failed to create draggers', e);
		return Promise.reject();
	}
};

const processSourceMaps = async (
	sources: SourceConfig[]
): Promise<OverlayPoint[]> => {
	console.log('All sources: ', sources);

	const validSources = sources.filter(source => {
		const match = window.location.href.match(source.match);
		return !!match;
	});

	const overlays: OverlayPoint[] = [];

	for (let i = 0; i < validSources.length; i++) {
		const source = validSources[i];

		const extractor = source.idExtractor;

		if (extractor.type === 'querySelector') {
			const idElement = document.querySelector(extractor.querySelector);
			if (idElement && idElement.textContent) {
				const newOverlays = await getOverlays(source, idElement.textContent);
				overlays.push(...newOverlays);
			}
		}

		if (extractor.type === 'urlRegex') {
			const urlMatches = window.location.href.match(extractor.regex);
			if (urlMatches && urlMatches.length > 1) {
				const newOverlays = await getOverlays(source, urlMatches[1]);
				overlays.push(...newOverlays);
			}
		}

		if (extractor.type === 'elementAttribute') {
			const idElement = document.querySelector(extractor.querySelector);
			if (idElement) {
				const attr = idElement.attributes.getNamedItem(extractor.attribute);
				if (attr && attr.value) {
					if (extractor.attributeRegex) {
						const attrMatches = attr.value.match(extractor.attributeRegex);
						if (attrMatches && attrMatches.length > 1) {
							const newOverlays = await getOverlays(source, attrMatches[1]);
							overlays.push(...newOverlays);
						}
					} else {
						const newOverlays = await getOverlays(source, attr.value);
						overlays.push(...newOverlays);
					}
				}
			}
		}
	}
	console.log(overlays);
	return overlays;
};

export const mountGrabberOverlays = getSources('http://localhost:9999')
	.catch(err => {
		console.error(
			'Failed to fetch sources from entity-integration server!',
			err
		);
	})
	.then(async sources => {
		// Inject click & drag overlays into the page
		const done: OverlayPoint[] = await processSourceMaps(sources);
		render(
			<>
				{done.map(point => (
					<Overlay {...point} />
				))}
			</>,
			reactMount
		);
	});
