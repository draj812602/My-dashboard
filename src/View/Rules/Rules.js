import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import Loader from 'react-loader-spinner';

import GoBack from '../../Components/GoBack';
import DeviceInfo from '../../Components/Rules_Components/Create_rule/DeviceInfo';
import ComruleNamecomp from '../../Components/Rules_Components/CombinationalRule/CombinationRuleNameCOntainer';
import CompList from '../../Components/Rules_Components/Create_rule/ComponentList';
import { GETCOMPONENTSRULES, GETCOMBRULENAME } from '../../Queries';
import { DELETERULE, DELETECOMBINATIONRULE } from '../../Mutations';
import Loaders from '../../Components/Loader/Loader';
import DeleteModalRule from '../../Components/Modals/DeleteRule';

function Rules(props) {
	let history = useHistory();
	let mac = props.match.params.mac_address;

	const [deletestate, setdeletestate] = useState(null);
	const [device_info, setdevice_info] = useState([]);
	const [Device_comp, setDevice_comp] = useState([]);
	const [viewDataRulecomb, setviewDataRulecomb] = useState([]);
	const [activeBtn, setActiveBtn] = useState(
		localStorage.getItem('tab_com_active') || 'device component'
	);
	const [circleModal, setcircleModal] = useState(false);
	const [showRuleDeleteModal, setshowRuleDeleteModal] = useState(false);
	const [deleteRuleData, setdeleteRuleData] = useState({});
	const [combRuledeletedata, setcombRuledeletedata] = useState({});
	const toggleSidebarState = localStorage.getItem("sidebarTstate");

	const { loading, data } = useQuery(GETCOMPONENTSRULES, {
		fetchPolicy: 'network-only',
		variables: { mac_address: mac },
	});

	let [
		getCOnditionNameDataview,
		{ loading: loadingConditionView, data: viewConditionView },
	] = useLazyQuery(GETCOMBRULENAME, {
		fetchPolicy: 'network-only',
		onCompleted: (data) => { },
	});

	const [deleteRuleFun] = useMutation(DELETERULE, {
		update() {
			props.history.goBack();
		},
	});

	const [deleteComRule] = useMutation(DELETECOMBINATIONRULE, {
		update() {
			getCOnditionNameDataview({
				variables: {
					mac_address: mac,
				},
			});
			setcircleModal(false);
			setshowRuleDeleteModal(false);
		},
	});
	useEffect(() => {
		if (loading === false) {
			setdevice_info(data.getDevCompsRules.device_info);

			setDevice_comp(data.getDevCompsRules.device_components);
		}
	}, [data, loading]);

	useEffect(() => {
		if (loadingConditionView === false) {
			setviewDataRulecomb(viewConditionView);
		}
	}, [loadingConditionView, viewConditionView]);
	useEffect(() => {
		if (activeBtn === 'combinational rule') {
			getCOnditionNameDataview({
				variables: {
					mac_address: mac,
				},
			});
		}
	}, [activeBtn, getCOnditionNameDataview, mac]);

	const closeRuleModal = () => {
		setshowRuleDeleteModal(false);
	};
	const removeRule = (rId, cId, ind) => {
		setdeletestate('deleteRuleCondition');
		let d = {
			rId,
			cId,
			ind,
		};
		setdeleteRuleData(d);
		setshowRuleDeleteModal(true);
	};

	//consiton delete
	const RemoveRule = async (rId) => {
		setdeletestate('CombinationRule');
		setshowRuleDeleteModal(true);
		let d = {
			rId,
			mac,
		};
		setcombRuledeletedata(d);
		// try {
		// 	await deleteCombRule({
		// 		variables: {
		// 			mac_address: mac,
		// 			component_id: deleteRuleData.cId,
		// 			rule_id: deleteRuleData.rId,
		// 		},
		// 	});
		// } catch (err) {
		// 	setcircleModal(false);
		// }
	};

	const deleteRule = async () => {
		setcircleModal(true);

		if (deletestate === 'CombinationRule') {
			try {
				await deleteComRule({
					variables: {
						mac_address: mac,
						comb_rule_id: combRuledeletedata.rId,
					},
				});
			} catch (err) {
				setcircleModal(false);
			}
		}
		if (deletestate === 'deleteRuleCondition') {
			try {
				await deleteRuleFun({
					variables: {
						mac_address: mac,
						component_id: deleteRuleData.cId,
						rule_id: deleteRuleData.rId,
					},
				});
			} catch (err) {
				setcircleModal(false);
			}
		}
	};

	const tabBtnsClick = (d) => {
		localStorage.setItem('tab_com_active', d);
		setActiveBtn(d);
		if (d === 'combinational rule') {
			getCOnditionNameDataview({
				variables: {
					mac_address: mac,
				},
			});
		}
		//	history.push(`/device/${mac}/trigger_rule`);
	};
	const combinationalRuleBtnClick = () => {
		history.push(`/device/${mac}/trigger_rule/create`);
	};

	const viewCombRUle = (rId) => {
		history.push(`/device/${mac}/trigger_rule/${rId}`);
	};

	if (loading) return <Loaders />;
	return (
		<div>
			<div className={
				toggleSidebarState === "true" ? "fixedHead_shrink" : "fixedHead"
			}>
				<GoBack />
				<div className="textWithBack fs-2 ml-5">Device settings</div>
			</div>
			<br></br>
			<br></br>
			<br></br>
			<DeviceInfo device_info={device_info} />

			<hr className="my-4" />

			{Device_comp.length > 0 && (
				<div className="d-flex">
					<div className="btns-group">
						<div
							className={
								activeBtn === 'device component' ? 'active-btn' : 'inactive-btn'
							}
							style={{ padding: '4px 8px' }}
							onClick={() => tabBtnsClick('device component')}>
							Device component lists
						</div>
						<div
							className={
								activeBtn === 'combinational rule'
									? 'active-btn'
									: 'inactive-btn'
							}
							style={{ padding: '4px 8px' }}
							onClick={() => tabBtnsClick('combinational rule')}>
							Combinational rule lists
						</div>
					</div>

					{(activeBtn === 'device component' ||
						viewConditionView?.getCombinationalRuleNames.length > 0) && (
							<button
								type="button"
								className="btn btn-primary ml-auto"
								onClick={combinationalRuleBtnClick}>
								Create Combinational Rule
							</button>
						)}
				</div>
			)}
			{loadingConditionView && <Loaders margin_top={30} />}
			{activeBtn === 'device component' ? (
				<div className="fs-5 mt-3 mb-2">Device components</div>
			) : (
				<>
					{viewConditionView?.getCombinationalRuleNames.length <= 0 ? (
						<div className="d-flex mt-5">
							<div className="m-auto text-center pt-5">
								<div className="fs-4">No rules available.</div>
								<div className="fs-4 text-black-50">
									Create a combinational rules of multiple components together.
								</div>
								<br />
								<button
									type="button"
									className="btn btn-primary ml-auto"
									onClick={combinationalRuleBtnClick}>
									Create Combinational Rule
								</button>
							</div>
						</div>
					) : (
						viewConditionView?.getCombinationalRuleNames.length >= 0 && (
							<>
								<div className="fs-5 mt-3 mb-2"><b>Combinational rule list</b></div>
								<ComruleNamecomp
									data={viewDataRulecomb?.getCombinationalRuleNames}
									viewCombRUle={viewCombRUle}
									RemoveRule={RemoveRule}
								/>
							</>
						)
					)}
				</>
			)}

			{activeBtn === 'device component' && (
				<CompList Device_comp={Device_comp} removeRule={removeRule} mac={mac} />
			)}

			<DeleteModalRule
				showRuleDeleteModal={showRuleDeleteModal}
				conditioNdelete={deletestate}
				closeRuleModal={closeRuleModal}
				deleteRule={deleteRule}
				circleModal={circleModal}
			/>
		</div>
	);
}

export default Rules;
