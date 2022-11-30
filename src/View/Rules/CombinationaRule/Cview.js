import React, { useContext, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { GETCOMPONENTSRULES, GETCOMBRULEDATA } from '../../../Queries';
import { CREATECOMBINATIONRULE, EDITCOMBINATIONRULE } from '../../../Mutations';
import Loaders from '../../../Components/Loader/Loader';
import EditCRuleCOmp from './CviewEdit';

import GoBack from '../../../Components/GoBack';
import InputFieldCombinational from '../../../Components/Rules_Components/CombinationalRule/InputField';
import { GlobalCOntext } from '../../../Context/GlobalContext';

function Cview(props) {
	let { mac_address, c_rule_id } = props.match.params;

	const { emailData } = useContext(GlobalCOntext);
	const { register, handleSubmit, errors } = useForm();
	const [editcombRule, seteditcombRule] = useState(false);
	const [rowDeleteIndex, setRowDeleteIndex] = useState(null);
    const toggleSidebarState = localStorage.getItem("sidebarTstate");

	const { loading, data } = useQuery(GETCOMPONENTSRULES, {
		fetchPolicy: 'network-only',
		variables: { mac_address },
	});

	const [
		getcruleMutation,
		{ loading: loadingCView, data: viewRuledata },
	] = useLazyQuery(GETCOMBRULEDATA, {
		fetchPolicy: 'network-only',
	});

	const [combinationalRuleMutation, { loading: loadingCompSave }] = useMutation(
		CREATECOMBINATIONRULE,
		{
			update(proxy, result) {
				localStorage.setItem('tab_com_active', 'combinational rule');
				props.history.goBack();
			},
		}
	);
	const [
		editCombinationalRuleMutation,
		{ loading: loadingEditCompSave },
	] = useMutation(EDITCOMBINATIONRULE, {
		update(proxy, result) {
			seteditcombRule(false);
		},
	});

	useEffect(() => {
		if (c_rule_id !== 'create') {
			try {
				getcruleMutation({
					variables: {
						mac_address: mac_address,
						comb_rule_id: parseInt(c_rule_id),
					},
				});
			} catch (error) {}
		}
	}, [c_rule_id, getcruleMutation, mac_address, props.match.params]);

	const combinationRuleFormSubmit = async (e) => {
		e.mac_address = mac_address;
		e.emailDat = emailData;
		if (c_rule_id === 'create') {
			try {
				await combinationalRuleMutation({
					variables: { input: e },
				});
			} catch (err) {}
		} else {
			// e.comb_rule_id = parseInt(c_rule_id)
			//  console.log(e);
			try {
				await editCombinationalRuleMutation({
					variables: { input: e },
				});
			} catch (err) {
				console.log(err);
			}
		}
	};
	const cancelClick = () => {
		seteditcombRule(false);
	};
	if (loading && loadingCView) return <Loaders />;

	const EditClickCombRule = () => {
		seteditcombRule(true);
	};
	const CancelClickCombRule = () => {
		props.history.goBack();
	};
	return (
		<>
			<div className={
					toggleSidebarState === "true" ? "fixedHead_shrink" : "fixedHead"
				}>
				<GoBack />

				<div className="fs-2  textWithBack text-primary  ml-5">
					{c_rule_id === 'create'
						? 'Create combination rule'
						: editcombRule === false
						? 'View combination rule'
						: 'Edit combination rule'}
				</div>
				<div className="row">
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-3 ml-5 fs-5 text-muted">
						Setting rules with their conditions will help you create an
						efficient device monitoring.
					</div>
				</div>
			</div>
			<br />
			<br />

			{(c_rule_id === 'create' || editcombRule === true) && (
				<>
					<br />
					<InputFieldCombinational
						seteditcombRule={seteditcombRule}
						errors={errors}
						handleSubmit={handleSubmit}
						register={register}
						combinationRuleFormSubmit={combinationRuleFormSubmit}
						data={data?.getDevCompsRules}
						mac={mac_address}
						c_rule_id={c_rule_id}
						cancelClick={cancelClick}
						CancelClickCombRule={CancelClickCombRule}
						loadingCompSave={loadingCompSave}
						loadingEditCompSave={loadingEditCompSave}
						loading={loading}
						viewRuledata={viewRuledata && viewRuledata.getCombinationalRuleData}
						getcruleMutation={getcruleMutation}
						mac_address={mac_address}
						setRowDeleteIndex={setRowDeleteIndex}
						rowDeleteIndex={rowDeleteIndex}
					/>
				</>
			)}

			{c_rule_id !== 'create' && editcombRule === false && (
				<EditCRuleCOmp
					viewRuledata={viewRuledata?.getCombinationalRuleData}
					EditClickCombRule={EditClickCombRule}
					CancelClickCombRule={CancelClickCombRule}
				/>
			)}
		</>
	);
}

export default Cview;
