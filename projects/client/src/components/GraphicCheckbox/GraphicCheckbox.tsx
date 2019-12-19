import React, { FC } from 'react';

type GraphicCheckboxProps = {
	id: string;
	name: string;
	title?: string;
};

export const GraphicCheckbox: FC<GraphicCheckboxProps> = ({
	id,
	name,
	title,
}) => {
	return (
		<label htmlFor={id}>
			<input type="radio" id={id} name={name} />
			{title}
		</label>
	);
};
