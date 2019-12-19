import React, { Component, ReactNode } from 'react';
import { MdBusiness } from 'react-icons/md';

type DraggableProps = {
	data: any;
};

export class Draggable extends Component<DraggableProps> {
	dragImage: HTMLDivElement | null = null;

	onDragStart = (ev: React.DragEvent) => {
		const { data } = this.props;

		if (this.dragImage) {
			ev.dataTransfer.setDragImage(this.dragImage, 10, 10);
		}

		ev.dataTransfer.effectAllowed = "copy";
		ev.dataTransfer.setData('text/plain', JSON.stringify(data));
		ev.dataTransfer.setData('application/x-vis-entity-bundle', JSON.stringify(data));
		console.log('drag started!', ev.dataTransfer.types)
	};

	renderDragImage = (children: ReactNode) => {
		return (
			<div
				style={{
					position: 'absolute',
					transform: 'translateX(-99999px)',
				}}
				ref={node => {
					this.dragImage = node;
				}}
			>
				{children}
			</div>
		);
	};

	render() {
		return (
			<>
				{this.renderDragImage(
					<div className="grabber-drag-image">
						<div className="grabber-drag-image-icon" ><MdBusiness/></div> 
						<div className="grabber-drag-image-text">
							<span>
						{this.props.data.company_name ? this.props.data.company_name: "<No Company Name Provided>"}
</span>
						</div>
					</div>
				)}
				<div
					onDragStart={this.onDragStart}
					draggable
					className="grabber-draggable"
				>
					<div className='grabber-draggable-arrow'/>
					<div className='grabber-draggable-text'> Drag</div>
				</div>
			</>
		);
	}
}
