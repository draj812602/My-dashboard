import React, { useContext, useState } from 'react';
import StringWidget from './StringWidget';
import BooleanWidget from './BooleanWidget';

import { useMutation } from '@apollo/react-hooks';
import { SEND_COMMANDS } from '../../../Mutations';
import { GET_COMMAND_WIDGETS } from '../../../Queries';

import { GlobalContextMain } from '../../../Context/GlobalContextOne';

import { Modal } from 'react-bootstrap';

const CommandWidgetCOntainer = ({ data, HistoryIconClick }) => {
	let context = useContext(GlobalContextMain);

	let device_id = parseInt(
		context.currUrlNameDevice.split('780003a2-2b90-46d2-9af8-f58e9eb41e06')[1]
	);
	const [showResponseModel, setshowResponseModel] = useState(false);
	const [showResponceText, setshowResponceText] = useState({});

	const [
		cmdRunFunctionmGql,
		{ error: cmdError, loading: cmdLoading },
	] = useMutation(SEND_COMMANDS, {
		update(proxy, result) {
			let outPt = result.data.sendC2DMessage.response[0];
			console.log(outPt);
			let op = {
				request_payload: outPt.request_payload,
				request_time: outPt.request_time,
				response_code: outPt.response_code,
				response_payload: outPt.response_payload,
				response_time: outPt.response_time,
				response_type: outPt.response_type,
			};
			setshowResponceText(op);
			setshowResponseModel(true);
		},

		refetchQueries: [
			{
				query: GET_COMMAND_WIDGETS,
				variables: { device_id: device_id },
			},
		],
	});

	const cmdRunFunctionm = async (dta) => {
		let sendData = {
			command_widget_id: data.command_widget_id,
			request_payload: dta.request_payload,
		};

		try {
			await cmdRunFunctionmGql({ variables: { input: sendData } });
		} catch (error) {
			setshowResponseModel(false);
		}
	};

	const PrettyJSOnRIghtPannel = ({ data }) => {
		return (
			<div>
				<pre className="text-black">{JSON.stringify(data, null, 2)}</pre>
			</div>
		);
	};

	return (
		<div>
			<Modal
				show={showResponseModel}
				dialogClassName="device_modal_class"
				onHide={() => setshowResponseModel(false)}
				backdrop="static"
				size="lg"
				keyboard={true}>
				<div className="d-flex mb-2">
					<span className="modal_header">Response</span>
					<i
						className="ri-close-line ri-lg ml-auto fs-4"
						onClick={() => setshowResponseModel(false)}></i>
				</div>
				<PrettyJSOnRIghtPannel data={showResponceText} />
			</Modal>

			<div>
				{data.command_data_type === 'string' && (
					<StringWidget
						data={data}
						HistoryIconClick={HistoryIconClick}
						cmdRunFunctionm={cmdRunFunctionm}
						cmdLoading={cmdLoading}
					/>
				)}
				{data.command_data_type === 'boolean' && (
					<BooleanWidget
						data={data}
						HistoryIconClick={HistoryIconClick}
						cmdRunFunctionm={cmdRunFunctionm}
						cmdLoading={cmdLoading}
					/>
				)}
			</div>
		</div>
	);
};

export default CommandWidgetCOntainer;
