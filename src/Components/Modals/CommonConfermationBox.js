import React from 'react';
import { Modal } from 'react-bootstrap';

const CommonConfermationBox = ({
	closeConfermationModal,
	YesClick,
	ShowConfermationBox,
	loadingC,
	openIn,
	headingText,
	SubHeading,
}) => {
	return (
		<Modal
			size="xs"
			show={ShowConfermationBox}
			dialogClassName=""
			backdrop="static"
			onHide={closeConfermationModal}>
			<div className="d-flex mb-2">
				<span className="modal_header">{headingText}</span>
				<i
					className="ri-close-line ri-lg ml-auto fs-4"
					onClick={closeConfermationModal}></i>
			</div>
			<div className="modal_text fs-5">{SubHeading}</div>
			<div className="mt-4" align="right">
				<button
					className="btn btn-secondary mr-2"
					disabled={loadingC}
					onClick={closeConfermationModal}>
					Cancel
				</button>
				<button
					className="btn btn-primary"
					disabled={loadingC}
					onClick={(e) => YesClick(e)}>
					{openIn === 'PublishTemplate' && 'Publish'}
					{openIn === 'ConnectionInformation' && 'Refresh'}
					{loadingC && <span className="spinner-border float-right"></span>}
				</button>
			</div>
		</Modal>
	);
};

export default CommonConfermationBox;
