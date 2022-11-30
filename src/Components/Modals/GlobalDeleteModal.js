import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

function GlobalDeleteModal({
	rowDataClicked,
	showDeleteModal,
	DeleteButtonClickModal,
	ShowDeleteModalFunc,
	openIn,
	loading,
	heading,
}) {
	let entries;

	if (rowDataClicked && rowDataClicked !== null && rowDataClicked !== 'null') {
		entries = rowDataClicked !== null && Object.entries(rowDataClicked);
	}

	return (
		<Modal
			size="xs"
			show={showDeleteModal}
			dialogClassName=""
			backdrop="static"
			onHide={ShowDeleteModalFunc}>
			<div className="mb-2 modal_header d-flex">
				{rowDataClicked ? (
					<div className="fs-5">
						Delete "<b>{entries && entries[1][1]}" </b> {openIn}?
					</div>
				) : (
					<div className="fs-5">{heading}</div>
				)}

				<i
					className="ri-close-line ri-lg  fs-4 ml-auto"
					onClick={ShowDeleteModalFunc}></i>
			</div>
			<div className="modal_text fs-5">
				Please rethink your decision because you will not be able to undo this
				action.
			</div>
			<div className="mt-5" align="right">
				<button
					className="btn btn-danger mr-2"
					disabled={loading}
					onClick={() => DeleteButtonClickModal(rowDataClicked)}>
					Delete
					{loading && <span className="spinner-border float-right"></span>}
				</button>
				<button
					className="btn btn-secondary"
					disabled={loading}
					onClick={ShowDeleteModalFunc}>
					Cancel
				</button>
			</div>
		</Modal>
	);
}

export default GlobalDeleteModal;
