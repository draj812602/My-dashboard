import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

import { useMutation } from '@apollo/react-hooks';
import { GENERATE_NEW_MQTT_PASSWORD } from '../../Mutations/index';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import GetTimedifference from '../Utilites/GetTimeDifference';
import ShowExpTime from '../Utilites/ShowExpTimeData';
import CommonConfermationBox from '../../Components/Modals/CommonConfermationBox';

import { toast } from 'react-toastify';

function ConnectionInfoDevice({ CloseConnModal, showCOnnectionInfoModal }) {
	const context = useContext(GlobalContextMain);
	let connInfo = context.connectionInfoData?.getDeviceConnectionInfo;
	// console.log("conninfo",connInfo)
	// Confermation box
	const [ShowConfermationBox, setShowConfermationBox] = useState(false);

	const [regenerateMQTTpassGql, { loading: loadingRefreshToken }] = useMutation(
		GENERATE_NEW_MQTT_PASSWORD,
		{
			update(proxy, result) {
				let res = result.data.reGenerateSaSToken;
				let d = {
					getDeviceConnectionInfo: {
						...connInfo,
						mqtt_password: res.mqtt_password,
						mqtt_pass_expiry_time: res.mqtt_pass_expiry_time,
						is_mqtt_pass_expired: res.mqtt_pass_expiry_time,
					},
				};

				context.connectionInfoDataFunc(d);
				setShowConfermationBox(false);
			},
		}
	);

	const RefreshPassword = async () => {
		setShowConfermationBox(true);
	};

	var PassedDate = connInfo?.mqtt_pass_expiry_time;
	let difference = +new Date(PassedDate) - +new Date();
	let timeLeft = {};
			

			if (difference > 0) {
				timeLeft = {
					year: Math.floor(difference / (1000 * 60 * 60 * 24 * 31 * 12)),
					months: Math.floor(difference / (1000 * 60 * 60 * 24 * 31)),
					weeks: Math.floor(difference / (1000 * 60 * 60 * 24 * 7)),
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				};
			}
			console.log("timedifference",timeLeft)
	
	// const exp_date = GetTimedifference(PassedDate);
	const mqttpasstimeTooltip = (props) => (
		<Tooltip id="toolTipRightBar" {...props}>
			{timeLeft.hours < 1 ? (
				<>
					<ShowExpTime timeData={`${timeLeft.minutes} minutes left`} />
				</>
			) : timeLeft.days < 1 ? (
				<>
					<ShowExpTime timeData={`${timeLeft.hours} hours left`} />
				</>
			) : timeLeft.days < 7 ? (
				<>
					<ShowExpTime timeData={`${timeLeft.days} days left`} />
				</>
			) : timeLeft.weeks <= 4 ? (
				<>
					<ShowExpTime timeData={`${timeLeft.weeks} weeks left`} />
				</>
			) : timeLeft.weeks >= 5 && timeLeft.months < 12 ? (
				<>
					<ShowExpTime timeData={`${timeLeft.months} months left`} />
				</>
			) : (
				<>
					<ShowExpTime timeData={`${timeLeft.year} years left`} />
				</>
			)}
			{/* {connInfo.mqtt_pass_expiry_time} */}
		</Tooltip>
	);
	const closeConfermationModal = () => {
		setShowConfermationBox(false);
	};

	const YesClick = async () => {
		let device_id = Number(
			context.currUrlNameDevice.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
		);

		await regenerateMQTTpassGql({
			variables: { device_id },
		});
	};

	return (
		<div>
			<CommonConfermationBox
				closeConfermationModal={closeConfermationModal}
				YesClick={YesClick}
				ShowConfermationBox={ShowConfermationBox}
				loadingC={loadingRefreshToken}
				headingText={'Do you really want to refresh the MQTT pasword ?'}
				SubHeading="Here some text which will help user to think twice before refreshing the token"
				openIn={'ConnectionInformation'}
			/>
			<Modal
				size="lg"
				show={showCOnnectionInfoModal}
				backdrop="static"
				onHide={CloseConnModal}>
				<div className="mb-2 modal_header d-flex ">
					<div className="col-11">
						{`${
							context.currUrlNameDevice?.split(
								'780003a2-2b90-46d2-9af8-f58e9eb41e06'
							)[0]
						} - Connection Information`}
					</div>
					<i
						className="ri-close-line ri-lg fs-4 ml-auto float-right"
						onClick={CloseConnModal}></i>
				</div>

				{connInfo !== null ? (
					<div>
						<hr className="mb-3" />
						<div className="fs-5 text-muted col-11">Connection String</div>
						<span className="float-right ">
							<i
								className="ri-file-copy-line ri-lg delete_rule "
								title="Copy"
								onClick={() => {
									navigator.clipboard.writeText(connInfo?.connection_string);
									toast.info('Connection String Copied', {
										autoClose: 2000,
									});
								}}></i>
						</span>
						<div className="fs-4  mb-2 col-11">
							{connInfo?.connection_string}
						</div>
						<hr />
						<div className="fs-5 text-muted col-11 ">MQTT broker address </div>
						<span className="float-right ">
							<i
								className="ri-file-copy-line ri-lg delete_rule ml-auto float-right"
								title="Copy"
								onClick={() => {
									navigator.clipboard.writeText(connInfo?.mqtt_broker_address);
									toast.info('MQTT broker address Copied', {
										autoClose: 2000,
									});
								}}></i>
						</span>
						<div className="fs-4  mb-2 col-11">
							{connInfo?.mqtt_broker_address}
						</div>
						<hr />
						<div className="fs-5 text-muted col-11 ">MQTT user name</div>
						<span className="float-right ">
							<i
								className="ri-file-copy-line ri-lg delete_rule ml-auto float-right"
								title="Copy"
								onClick={() => {
									navigator.clipboard.writeText(connInfo?.mqtt_user_name);
									toast.info('MQTT user name Copied', {
										autoClose: 2000,
									});
								}}></i>
						</span>
						<div className="fs-4  mb-2 col-11">{connInfo?.mqtt_user_name}</div>
						<hr />
						<div className="fs-5 text-muted col-11 ">
							MQTT password
							<OverlayTrigger placement="top" overlay={mqttpasstimeTooltip}>
								<i
									className="ri-refresh-line ri-lg position-absolute mt-1 ml-4 text-info font-weight-bolder"
									onClick={RefreshPassword}></i>
							</OverlayTrigger>
						</div>

						<span className="float-right ">
							<i
								className={
									connInfo?.is_mqtt_pass_expired
										? 'd-none'
										: 'ri-file-copy-line ri-lg delete_rule ml-auto float-right'
								}
								title="Copy"
								onClick={() => {
									navigator.clipboard.writeText(connInfo?.mqtt_password);
									toast.info('MQTT password Copied', {
										autoClose: 2000,
									});
								}}></i>
						</span>

						<div
							className={
								connInfo?.is_mqtt_pass_expired
									? 'fs-4  mb-2 col-11'
									: 'fs-4  mb-2 col-11'
							}>
							{connInfo?.mqtt_password}
						</div>
					</div>
				) : (
					<h4 className="text-info fs-4  ml-3">
						Ooops... No connection information for thsi device
					</h4>
				)}
			</Modal>
		</div>
	);
}

export default ConnectionInfoDevice;
