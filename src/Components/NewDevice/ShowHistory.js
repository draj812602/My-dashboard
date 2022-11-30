import React, { useState } from 'react';

import { Accordion, useAccordionToggle } from 'react-bootstrap';

const ShowHistory = ({ historyData }) => {
	const [activeKey, setActiveKey] = useState(0);

	function CustomToggle({ children, eventKey, handleClick }) {
		const decoratedOnClick = useAccordionToggle(eventKey, () => {
			handleClick();
		});

		return (
			<div className="collapse-header" type="button" onClick={decoratedOnClick}>
				{children}
			</div>
		);
	}

	return (
		<div>
			<Accordion defaultActiveKey={0} activeKey={activeKey}>
				{historyData?.getCapabilityhistory?.history.map((item, index) => (
					<div key={index} className="mb-4 mr-1">
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
										<div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
											<div className="fs-5 text-secondary">Request time</div>
											<div
												className={
													((item.response_code === 404 ||
														item.response_code === 504) &&
														'text-warning fs-4') ||
													(item.response_code === 500 && 'text-danger fs-4') ||
													(item.response_code === 200 && 'text-success fs-4')
												}>
												{item.request_time}
											</div>
										</div>
									</div>
								</div>
								<div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
									<div className="d-flex justify-content-end mr-1">
										{activeKey === index.toString() ? (
											<i
												className="ri-arrow-up-s-line up_down"
												title="Hide details"></i>
										) : (
											<i
												className="ri-arrow-down-s-line up_down"
												title="Show details"></i>
										)}
									</div>
								</div>
							</div>
						</CustomToggle>

						<div className="collapse_body px-2">
							<Accordion.Collapse eventKey={index.toString()}>
								<div className="p-2">
									<div className="fs-6 text-secondary">Request Time</div>
									<div className="fs-5">{item.request_time}</div>
									<div className="fs-6 text-secondary">Request Payload</div>
									<div className="fs-5">{item.request_payload}</div>
									<div className="fs-6 text-secondary">Response Time</div>
									<div className="fs-5">{item.response_time}</div>
									<div className="fs-6 text-secondary">Response Payload</div>
									<div
										className={
											((item.response_code === 404 ||
												item.response_code === 504) &&
												'text-warning fs-4') ||
											(item.response_code === 500 && 'text-danger fs-4') ||
											(item.response_code === 200 && 'text-success fs-4')
										}>
										{item.response_payload}
									</div>
								</div>
							</Accordion.Collapse>
						</div>
					</div>
				))}
			</Accordion>
		</div>
	);
};

export default ShowHistory;
