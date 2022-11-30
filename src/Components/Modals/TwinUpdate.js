/** @format */

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import TwinForm from '../Device/TwinUpdate_form';

import '../../Styles/modal_popover.css';

import SideBar_data from '../../Files/All_Json_data';

export default function TwinUpdate(props) {
	let twin_side_bar = null;
	const [sidebar_data, setsidebar_data] = useState(null);
	const [disabled, setdisabled] = useState(false);
	const [circleloading, setcircleloading] = useState(false);
	const [activeM, setactiveM] = useState(0);

	useEffect(() => {
		setsidebar_data(SideBar_data.twin_side_bar);
	}, []);

	const save_data = (e) => {
		setcircleloading(true);
		setdisabled(true);

		setTimeout(() => {
			setcircleloading(true);
			setdisabled(true);
		}, 3000);
	};
	const Click_evt = (name, ind) => {
		if (name.state) {
			setactiveM(ind);
		}
	};

	return (
		<div>
			<Modal
				show={props.show}
				dialogClassName="twin_update_modal"
				onHide={props.handleClose}
				backdrop="static"
				keyboard={true}>
				<div className="row container-fluid">
					<div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 side_twin_modal">
						<div className="side_bar_container">
							<div className="Tittle_twin_update">Twin Update</div>
							{sidebar_data !== null &&
								sidebar_data.map((li, index) => (
									<div
										className={
											index === activeM
												? 'side_menu_twin_active'
												: li.state
												? 'side_menu_twin'
												: 'side_menu_twin_disabled'
										}
										key={index}
										onClick={() => Click_evt(li, index)}>
										{li.name}
									</div>
								))}
						</div>
					</div>

					<div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 main_content">
						{activeM === 0 && (
							<TwinForm
								data={props}
								save_data={save_data}
								handleClose={props.handleClose}
								circleloading={circleloading}
								activeM={activeM}
								disabled={disabled}
							/>
						)}
					</div>
				</div>
			</Modal>
		</div>
	);
}
