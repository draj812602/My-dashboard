import React from 'react';
import loaderimage from '../../Images/loader_gif.gif';

function loader(props) {
	return (
		<>
			{props.height !== undefined ? (
				<div
					className="loading-container"
					style={{
						left: `${props.margin_main}px`,
						top: `${props.margin_top}px`,
					}}>
					<img
						src={loaderimage}
						alt={'Loading ...'}
						className="loaderimage"
						style={{ height: `${props.height}px`, width: `${props.width}px` }}
					/>
				</div>
			) : (
				<div
					className="loading-container"
					style={{ top: `${props.margin_top}px` }}>
					<img src={loaderimage} alt={'Loading ...'} className="loaderimage" />
				</div>
			)}
		</>
	);
}
export default loader;
