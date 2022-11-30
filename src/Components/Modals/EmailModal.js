import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

function EmailModal({
	showMailDeleteModal,
	closeMailModal,
	closeMailModalOnEdit,
	emailClicked,
	c_rule_id,
	data,
}) {
	const { register, handleSubmit, errors } = useForm();
	const [recipient, setRecipient] = useState(data?.recipient[0]);
	const [subject, setSubject] = useState(data?.subject);
	const [message, setMessage] = useState(data?.message);
	return (
		<div>
			<Modal
				show={showMailDeleteModal}
				backdrop="static"
				keyboard={true}
				size="lg">
				<div className="row">
					<form
						className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
						onSubmit={handleSubmit(emailClicked)}>
						<div className="form-row mt-3">
							<label
								className="col-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 col-form-label pt-1 "
								for="recipient">
								Recipient
							</label>
							<div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
								<input
									type="text"
									name="recipient"
									id="recipient"
									placeholder="Recipient name"
									value={recipient}
									onChange={(e) => {
										setRecipient(e.target.value);
									}}
									className={
										errors.recipient
											? 'error_input form-control bg-input-color'
											: 'form-control bg-input-color'
									}
									ref={register({
										required: 'Recipient is required',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: 'Invalid email address',
										},
									})}
								/>
								{errors.recipient && (
									<div>
										<span className="text-error">
											{errors.recipient.message}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="form-row mt-3">
							<label
								className="col-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 col-form-label pt-1"
								for="subject">
								Subject
							</label>
							<div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
								<input
									type="text"
									name="subject"
									id="subject"
									placeholder="Subject"
									value={subject}
									onChange={(e) => {
										setSubject(e.target.value);
									}}
									className={
										errors.subject
											? 'error_input form-control bg-input-color'
											: 'form-control bg-input-color'
									}
									ref={register({
										required: `Subject is required`,
									})}
								/>
								{errors.subject && (
									<div>
										<span className="text-error">{errors.subject.message}</span>
									</div>
								)}
							</div>
						</div>
						<div className="form-row my-3">
							<label
								className="col-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 col-form-label pt-1"
								for="message">
								Message
							</label>
							<div className="col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
								<textarea
									name="message"
									rows="9"
									cols="50"
									id="message"
									value={message}
									onChange={(e) => {
										setMessage(e.target.value);
									}}
									className={
										errors.message
											? 'error_input form-control bg-input-color'
											: 'form-control bg-input-color'
									}
									ref={register({
										required: `Please write some message`,
									})}
								/>
								{errors.message && (
									<div>
										<span className="text-error">{errors.message.message}</span>
									</div>
								)}
							</div>
						</div>
						<div className="form-group mr-lg-5 pr-lg-3">
							<button
								className="btn btn-outline-primary float-right ml-2"
								type="button"
								onClick={
									c_rule_id === 'create' ? closeMailModal : closeMailModalOnEdit
								}>
								Cancel
							</button>

							<button className="btn btn-success float-right">Submit</button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
}

export default EmailModal;
