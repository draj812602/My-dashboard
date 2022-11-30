/** @format */

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

function DeleteModal(props) {
	const [data, setdata] = useState(null);

	useEffect(() => {
		setdata(props.Delete_data);
	}, [props.Delete_data, props]);

	return (
		<div>
			<Modal
				show={props.show}
				dialogClassName="Delete_Modal"
				onHide={props.handleClose}
				backdrop="static"
				size="md"
				keyboard={true}>
				<div>
					{data !== null &&
						data.map((item, index) => (
							<div key={index}>
								<div className="d-flex mb-2">
									<span className="modal_header">{item.heading}</span>
									<i
										className="ri-close-line ri-lg ml-auto fs-4"
										onClick={props.handleClose}></i>
								</div>
								{props.deleteMultiwidgets === true ? (
									<div className="modal_text">
										Please rethink your decision because you will not be able to
										undo this action.
									</div>
								) : (
									<div className="modal_text">{item.content}</div>
								)}
								<div className="mt-5" align="right">
									{item.buttons &&
										item.buttons.map((li, index1) => (
											<button
												key={index1}
												className={'mr-2 btn ' + li.classs}
												disabled={props.circleloading}
												type={li.name === 'Delete' ? 'submit' : 'button'}
												onClick={() =>
													props.AllOnclick_event(li.buttonAction, index1)
												}>
												{li.name}

												{props.indexIdDelete === undefined
													? index1 === 1 &&
													  props.circleloading && (
															<span className="spinner-border float-right text-secondary"></span>
													  )
													: index1 === props.indexIdDelete &&
													  props.circleloading && (
															<span className="spinner-border float-right text-secondary"></span>
													  )}
												{}
											</button>
										))}
								</div>
							</div>
						))}
				</div>
			</Modal>
		</div>
	);
}

export default DeleteModal;
