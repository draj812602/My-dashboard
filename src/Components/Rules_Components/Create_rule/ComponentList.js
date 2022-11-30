import React, { useState } from 'react';
import { Accordion, useAccordionToggle } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function CustomToggle({ children, eventKey, handleClick }) {
	const decoratedOnClick = useAccordionToggle(eventKey, () => {
		handleClick();
	});

	return (
		<div
			className="collapse-header rounded"
			type="button"
			onClick={decoratedOnClick}>
			{children}
		</div>
	);
}
function ComponentList(props) {
	let his = useHistory();
	const [activeKey, setActiveKey] = useState(0);
	const AddRules = (data) => {
		localStorage.setItem('edit', false);

		his.push(`/Device/${props.mac}/createrule/${data.component_id}`);
	};
	const ViewRules = (data, li) => {
		//	console.log(li);
		localStorage.setItem('rule_id', li.rule_id);
		localStorage.setItem('edit', true);
		his.push(`/Device/${props.mac}/createrule/${data.component_id}`);
	};

	return (
		<div>
			{
				<Accordion defaultActiveKey={0} activeKey={activeKey}>
					{props.Device_comp.length > 0 &&
						props.Device_comp.map((item, index) => (
							<div key={index} className="mt-2">
								<CustomToggle
									eventKey={index.toString()}
									handleClick={() => {
										if (activeKey === index.toString()) {
											setActiveKey(null);
										} else {
											setActiveKey(index.toString());
										}
									}}>
									<div className="row no-gutters">
										<div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-9">
											<div className="row" key={index}>
												<div className="col-12 col-sm-12 col-md-8 col-lg-5 col-xl-5">
													<div className="fs-6 pb-1 text-secondary">Name</div>
													<div className="fs-5">{item.component_name}</div>
												</div>
											</div>
										</div>
										<div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
											{item.rules.length > 0 ? (
												<div className="d-flex justify-content-end mr-1">
													{activeKey === index.toString() ? (
														<i className="ri-arrow-up-s-line up_down"></i>
													) : (
														<i className="ri-arrow-down-s-line up_down"></i>
													)}
													<button className="btn btn-light text-primary mr-2">
														View rules
													</button>
													<button
														className="btn btn-primary mr-3"
														onClick={() => AddRules(item)}>
														Add rules
													</button>
												</div>
											) : (
												<div className="d-flex justify-content-end">
													<button
														className="btn btn-primary mr-3"
														onClick={() => AddRules(item)}>
														Add rules
													</button>
												</div>
											)}
										</div>
									</div>
								</CustomToggle>

								<div className="collapse_body box_style border-0">
									{activeKey !== null && <div className="divasHr"></div>}
									{item.rules.map((li) => (
										<Accordion.Collapse eventKey={index.toString()}>
											<>
												<div className="row no-gutters px-2 pt-2">
													<div className="col-12 col-s1-12 col-md-8 col-lg-8 col-xl-9">
														<div className="fs-5 mt-1 pl-2 pt-1">
															<span className="dot"></span>
															{li.rule_name}
														</div>
													</div>
													<div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 pr-1">
														<div className="d-flex justify-content-end pr-4">
															<button
																className="btn btn-light text-primary mr-2"
																onClick={() => ViewRules(item, li)}>
																View Details
															</button>
															<button
																className="btn btn-danger"
																type="button"
																onClick={() =>
																	props.removeRule(
																		li.rule_id,
																		item.component_id,
																		index
																	)
																}>
																Remove
															</button>
														</div>
													</div>
												</div>
												<hr className="mx-3"></hr>
											</>
										</Accordion.Collapse>
									))}
								</div>
							</div>
						))}
				</Accordion>
			}
		</div>
	);
}

export default ComponentList;
