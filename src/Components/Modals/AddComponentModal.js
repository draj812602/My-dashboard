import React from 'react';
import { Modal } from 'react-bootstrap';

import { useForm } from 'react-hook-form';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation'

const AddComponentModal = ({
	showAddComponentModal,
	closeAddComponentsModal,
	CreateTemplate,
	loadingAddComponentMutation,
}) => {
	const { register, handleSubmit, errors } = useForm();
	return (
		<Modal
			size="xs"
			show={showAddComponentModal}
			dialogClassName=""
			backdrop="static"
			onHide={closeAddComponentsModal}>
			<form onSubmit={handleSubmit(CreateTemplate)}>
				<div className="mb-2 modal_header d-flex">
					<div className="fs-5">Add component</div>
					<i
						className="ri-close-line ri-lg fs-4 ml-auto"
						onClick={closeAddComponentsModal}></i>
				</div>

				<div className="row">
					<div className="form-group col-12">
						<label className="label" htmlFor="component_name">
							Component name
						</label>

						<input
							type="text"
							name="component_name"
							className={
								errors.component_name
									? 'form-control error_input'
									: 'form-control'
							}
							placeholder="Component Name"
							ref={register({
								required: 'Component name is required',
								pattern: {
									value: SpecialCharValidation,
									message: 'You can not use special character',
								},
							})}
						/>

						{errors.component_name && (
							<div>
								<span className="text-error">
									{errors.component_name.message}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="text-right">
					<button
						className="btn btn-secondary mr-2"
						type="button"
						disabled={loadingAddComponentMutation}
						onClick={closeAddComponentsModal}>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						disabled={loadingAddComponentMutation}>
						Create
						{loadingAddComponentMutation && (
							<span className="spinner-border float-right"></span>
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default AddComponentModal;
