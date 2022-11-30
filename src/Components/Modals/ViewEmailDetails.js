import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

function ViewEmailDetails({ ShowViewEmailDetals, closeEmailViewModal, Data }) {
	return (
		<div>
			<Modal
				show={ShowViewEmailDetals}
				backdrop="static"
				onHide={closeEmailViewModal}
				keyboard={true}
				size="md">
				<div className="row m-0">
					<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
						<i
							className="ri-close-line ri-lg float-right"
							onClick={closeEmailViewModal}></i>
						<br />
						<div className="form-row mb-3">
							<div
								className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 fs-5 pb-1 text-secondary"
								for="recipient">
								Recipient
							</div>
							<div className="col-12 col-sm-12 col-md-9 col-lg-8 col-xl-8 ml-lg-4 ml-xl-4 fs-5">
								{Data?.recipient[0]}
							</div>
						</div>
						<div className="form-row mb-3">
							<div
								className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 fs-5 pb-1 text-secondary"
								for="recipient">
								Subject
							</div>
							<div className="col-12 col-sm-12 col-md-9 col-lg-8 col-xl-8 ml-lg-4 ml-xl-4 fs-5">
								{Data?.subject}
							</div>
						</div>
						<div className="form-row mb-3">
							<div
								className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 fs-5 pb-1 text-secondary"
								for="recipient">
								Message
							</div>
							<div className="col-12 col-sm-12 col-md-9 col-lg-8 col-xl-8 ml-lg-4 ml-xl-4 fs-5">
								{Data?.message}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default ViewEmailDetails;
