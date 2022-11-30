import React from 'react';

function DocumentSite() {
	return (
		<div className="DocuStyle">
			{/* <h1>here code for docs</h1> */}
			<iframe
				src="https://docs.wizcloud.io"
				id="wiznetdocs"
				title="wiznetdocs"
				style={{
					border: 'none',
					display: 'block',
					width: '92.5vw',
					height: '95.5vh',
				}}
			/>
		</div>
	);
}

export default DocumentSite;
