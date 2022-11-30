import React, { useState } from "react";
import { Accordion, useAccordionToggle } from "react-bootstrap";

import ProfileInputs from "../../Components/Profile/ProfileInputs";
import DisplayToken from "../../Components/Profile/DisplayToken";
import TopBar from "../Navigation/TopBar";

function CustomToggle({ children, eventKey, handleClick }) {
	const decoratedOnClick = useAccordionToggle(eventKey, () => {
		handleClick();
	});

	return (
		<div
			className="profileDropText px-4 py-2"
			type="button"
			onClick={decoratedOnClick}
		>
			{children}
		</div>
	);
}

function ProfileComp({ title }) {
	const [sucessCopy, setsucessCopy] = useState(false);
	const [activeKey, setActiveKey] = useState(0);

	const ProfileData = [
		{ ProfComp_name: "Profile Information" },
		{ ProfComp_name: "Token" },
	];

	let token = localStorage.getItem("btoken");
    let sidebarToggle = localStorage.getItem("sidebarTstate");

	const copyToken = () => {
		navigator.clipboard.writeText(token);
		setsucessCopy(true);
	};

	return (
		<div>
			<div>
				<TopBar name="Profile" searchbox={false} registerDevice={false} sidebarToggle={sidebarToggle} />
			</div>
			<div className="profile_container_comp">
				<Accordion defaultActiveKey={0} activeKey={activeKey}>
					{ProfileData.length > 0 &&
						ProfileData.map((item, index) => (
							<div key={index} className="mt-2">
								<CustomToggle
									eventKey={index.toString()}
									handleClick={() => {
										if (activeKey === index.toString()) {
											setActiveKey(null);
										} else {
											setActiveKey(index.toString());
										}
									}}
								>
									<div
										className="row"
										style={{ display: "flex", justifyContent: "space-between" }}
									>
										<div className="" key={index}>
											<div className="profileDropText">
												{item.ProfComp_name}
											</div>
										</div>
										<div className="">
											{activeKey === index.toString() ? (
												<i className="ri-arrow-up-s-line up_down"></i>
											) : (
												<i className="ri-arrow-down-s-line up_down"></i>
											)}
										</div>
									</div>
								</CustomToggle>

								<Accordion.Collapse
									className="col-12 box_style ml-2"
									eventKey={index.toString()}
								>
									{index === 0 ? (
										<div>
											<ProfileInputs />
										</div>
									) : (
										<div>
											<DisplayToken copyToken={copyToken} />
										</div>
									)}
								</Accordion.Collapse>
							</div>
						))}
				</Accordion>
			</div>
		</div>
	);
}

export default ProfileComp;
