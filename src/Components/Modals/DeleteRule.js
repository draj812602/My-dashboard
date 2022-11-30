import React from 'react';
import { Modal } from 'react-bootstrap';

function Delete({
	closeRuleModal,
	conditioNdelete,
	showRuleDeleteModal,
	deleteRule,
	circleModal,
}) {
	return (
		<div>
			<Modal
				show={showRuleDeleteModal}
				dialogClassName="Delete_Modal"
				backdrop="static"
				onHide={closeRuleModal}
				keyboard={true}>
				<div className="">
					<div className="d-flex mb-2">
						<span className="modal_header">
							{conditioNdelete === 'CombinationRule' &&
								'Remove this combanition of rules ?'}
							{conditioNdelete === 'deleteRuleCondition' && 'Remove rule'}
						</span>
						<i
							className="ri-close-line ri-lg ml-auto fs-4"
							onClick={closeRuleModal}></i>
					</div>
					{conditioNdelete === 'CombinationRule' && (
						<div className="modal_text mb-5 mt-2">
							These set of combinations and its conditions will be removed
							permanently and won’t be able to retrieve.
						</div>
					)}
					{conditioNdelete === 'deleteRuleCondition' && (
						<div className="modal_text mb-5 mt-2">
							The rule and its conditions will be removed permanently and won’t
							be able to retrieve.
						</div>
					)}
					<div className="float-right mt-2">
						<button
							className="btn btn-secondary mr-2"
							onClick={closeRuleModal}
							disabled={circleModal}>
							Cancel
						</button>
						<button
							className="btn btn-danger"
							onClick={deleteRule}
							disabled={circleModal}>
							Delete
							{circleModal && (
								<span className="spinner-border float-right"></span>
							)}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default Delete;
