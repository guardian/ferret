import React, { FC, useState, useEffect, useCallback } from 'react';
import { searchImages } from '../../services/images';
import _ from 'lodash';

import styles from './ImagePicker.module.css';
import { Button } from '@guardian/threads';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';

type UnsplashPickerProps = {
	onChange: (url: string) => void;
};

export const ImagePicker: FC<UnsplashPickerProps> = ({ onChange }) => {
	const [query, setQuery] = useState(
		_.sample(['flower', 'city', 'rocket', 'cash', 'mountains', 'waterfall']) ||
			'beach'
	);
	const [page, setPage] = useState(1);
	const [currentIndex, setCurrentIndex] = useState(0);

	const [totalPages, setTotalPages] = useState(0);
	const [images, setImages] = useState([] as any[]);

	const getImages = (q: string, page: number, selectEnd: boolean) => {
		searchImages(q, page)
			.then(i => {
				if (selectEnd) {
					setCurrentIndex(i.results.length - 1);
				} else {
					setCurrentIndex(0);
				}
				setImages(i.results);
				setPage(page);
				setTotalPages(i.total_pages);
				onChange(i.results[0].urls.small);
			})
			.catch(e => console.error(e));
	};

	const selectImage = (index: number) => {
		if (index >= 0 && index < images.length) {
			setCurrentIndex(index);
			onChange(images[index].urls.small);
		}

		if (index === -1 && page > 1) {
			getImages(query, page - 1, true);
		}

		if (index === images.length && page < totalPages) {
			getImages(query, page + 1, false);
		}
	};

	const debouncedGetImages = useCallback(_.debounce(getImages, 500), []);

	useEffect(() => getImages(query, page, false), []);

	return (
		<div className={styles.picker}>
			<input
				type="text"
				value={query}
				onChange={e => {
					setQuery(e.target.value);
					debouncedGetImages(e.target.value, page, false);
				}}
			/>
			<div className={styles.thumbs}>
				<Button
					appearance="transparent"
					icon={<MdKeyboardArrowLeft />}
					onClick={() => selectImage(currentIndex - 1)}
				/>
				{images.map((image, i) => (
					<div
						key={image.id}
						className={styles.picIcon}
						data-selected={i === currentIndex ? true : null}
						onClick={() => selectImage(i)}
					/>
				))}
				<Button
					appearance="transparent"
					icon={<MdKeyboardArrowRight />}
					onClick={() => selectImage(currentIndex + 1)}
				/>
			</div>
		</div>
	);
};
