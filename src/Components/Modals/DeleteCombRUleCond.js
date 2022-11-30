import React from "react";
import { Modal } from "react-bootstrap";

function DeleteCombRUleCond({
	cloaseCombConditionModal,
	showCombCondModal,
	deleteCombConditionModal,
	circleModal,
	rowDeleteIndex,
    loadingDeleteCombCondition
}) {
	return (
		<div>
			<Modal
				show={showCombCondModal}
				dialogClassName="Delete_Modal"
				backdrop="static"
				onHide={cloaseCombConditionModal}
				keyboard={true}
			>
				<div>
					<div className="d-flex mb-2">
						<span className="modal_header">Remove condition</span>
						<i
							className="ri-close-line ri-lg ml-auto fs-4"
							onClick={cloaseCombConditionModal}
						></i>
					</div>
					<div className="modal_text mb-5">
						The condition will be removed permanently and won’t be able to
						retrieve.
					</div>
					<div className="float-right mt-2">
						<button
							className="btn btn-secondary mr-2"
							onClick={cloaseCombConditionModal}
							disabled={loadingDeleteCombCondition}
						>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={() => {
								deleteCombConditionModal(rowDeleteIndex);
							}}
							disabled={loadingDeleteCombCondition}
						>
							Delete
							{loadingDeleteCombCondition && (
								<span className="spinner-border float-right"></span>
							)}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default DeleteCombRUleCond;
