import React from 'react';

// Ugh.
export const DirectoryInput = ({ onChange }) => {
	return (
		<input
			id="directory"
			webkitdirectory="true"
			type="file"
			onChange={onChange}
		/>
	);
};
