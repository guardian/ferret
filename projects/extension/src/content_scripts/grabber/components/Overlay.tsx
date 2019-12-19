import React, { Component } from 'react';
import { Draggable } from './Draggable';

type OverlayProps = { entityData: any; rect: null | ClientRect | DOMRect };

export class Overlay extends Component<OverlayProps> {

	render() {
		const { entityData, rect } = this.props;

		const style = rect
			? {
					position: 'absolute' as 'absolute',
					top: rect.top + (rect.height / 2) - 17,
					left: rect.right + 10,
			  }
			: { display: 'none' };

		return (
			<div
				className="grabber-overlay"
				style={style}
			>
				<Draggable data={entityData} />
			</div>
		);
	}
}
