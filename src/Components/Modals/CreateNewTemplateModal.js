import React, { useContext, useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { useMutation } from '@apollo/react-hooks';

import { CREATETEMPLATES } from '../../Mutations';
import { GETTEMPLATES, GETTEMPLATESLIST } from '../../Queries';

import { GlobalContextMain } from '../../Context/GlobalContextOne';
import { SpecialCharValidation } from '../../Files/SpecialCharValidation'

const CreateNewTemplateModal = ({
	triggerCreateTemplateModal,
	closeTemplateModal,
	settriggerCreateTemplateModal,

}) => {

	const { register, handleSubmit, errors } = useForm();
	const context = useContext(GlobalContextMain);

	const [createTemplatefun, { loading }] = useMutation(CREATETEMPLATES, {
		update(proxy, result) {
			let res = result.data.addTemplate.data[0];

			let newArray = {
				__typename: 'templateTable',
				column: context.templatetableData.column || [],
				data: context.templatetableData.data || [],
			};
			newArray.data.unshift(res);

			let data = proxy.readQuery({
				query: GETTEMPLATES,
			});

			data.getTemplate.data = [res, ...data.getTemplate.data];

			proxy.writeQuery({ query: GETTEMPLATES, data });
			context.createTemplateClick(newArray);
			settriggerCreateTemplateModal(false);
			context.stemodalOpenDeviceTemplate(null);
		},
	});
	//console.log(loading);
	const CreateTemplate = async (e) => {
		try {
			await createTemplatefun({ variables: { templateName: e.templateName } });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Modal
				show={triggerCreateTemplateModal}
				onHide={closeTemplateModal}
				backdrop="static"
				size="xs"
				keyboard={true}>
				<form onSubmit={handleSubmit(CreateTemplate)}>
					<div className="mb-2 modal_header d-flex">
						<div className="fs-5">Create Template</div>
						<i
							className="ri-close-line ri-lg fs-4 ml-auto"
							onClick={closeTemplateModal}></i>
					</div>
					<div className="row">
						<div className="form-group col-12">
							<label className="label" htmlFor="templateName">
								Template Name
							</label>

							<input
								type="text"
								name="templateName"
								className={
									errors.templateName
										? 'form-control error_input'
										: 'form-control'
								}
								placeholder="Template Name"
								ref={register({
									required: 'Template name is required',
									pattern: {
										value: SpecialCharValidation,
										message: 'You can not use special character',
									},
								})}
							/>

							{errors.templateName && (
								<div>
									<span className="text-error">
										{errors.templateName.message}
									</span>
								</div>
							)}
						</div>
					</div>
					<div className="text-right">
						<button
							className="btn btn-secondary mr-2"
							type="button"
							onClick={closeTemplateModal}>
							Cancel
						</button>
						<button className="btn btn-primary" disabled={loading}>
							Create
							{loading === true && (
								<span className="spinner-border float-right"></span>
							)}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default CreateNewTemplateModal;
