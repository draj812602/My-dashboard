/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Back from "../../Components/GoBack";
import { useForm, Controller } from "react-hook-form";
import InputFileds from "../../Components/Rules_Components/Create_rule/formFields";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import Loaders from "../../Components/Loader/Loader";
import DeleteModalRule from "../../Components/Modals/DeleteRule";
import DeleteConditionModal from "../../Components/Modals/DeleteCondition";

import {
	CREATERULESPERDEVCOMP,
	EDITCONDITIONS,
	DELETERULE,
	RULENAMECHECK,
	DELETECONDITION,
} from "../../Mutations";
import { GETRULESANDCONDITIONS } from "../../Queries";

function CreateRule(props) {
	const [showRuleDeleteModal, setshowRuleDeleteModal] = useState(false);
	const [showConditionModal, setshowConditionModal] = useState(false);
	const [circleModal, setcircleModal] = useState(false);

	// rule name change

	const [rukenameStatus, setrukenameStatus] = useState(false);
	const [checkRleRepeat, setcheckRleRepeat] = useState(null);

	const [indconditionDelete, setindconditionDelete] = useState({});
	const [ruleDataOnModalClick, setruleDataOnModalClick] = useState();

	const [showEdit, setshowEdit] = useState(true);
	const [rData, setrData] = useState({});
	const [prevData, setprevData] = useState();
	const [prevListData, setprevListData] = useState([]);
	const [circleLoading, setcircleLoading] = useState(false);
	const [isEditable, setisEditable] = useState(false);
	const [loading, setloading] = useState(false);

	let component_id = props.match.params.component_id;
	let mac = props.match.params.mac_address;
	const { register, handleSubmit, errors, control, reset } = useForm();

	const [rule_data, setrule_data] = useState({});

	const [inputList, setInputList] = useState([]);

	const toggleSidebarState = localStorage.getItem("sidebarTstate");

    const [saveData] = useMutation(CREATERULESPERDEVCOMP, {
		update(_, result) {
			setcircleLoading(false);
			setrukenameStatus(false);
			props.history.goBack();
		},
	});

	const [editData] = useMutation(EDITCONDITIONS, {
		update() {
			setcircleLoading(false);
			setrukenameStatus(false);
			setshowEdit(true);
		},
	});
	const [deleteCondition] = useMutation(DELETECONDITION, {
		update() {
			setcircleModal(false);
			setshowEdit(true);

			const list = [...inputList];
			list.splice(indconditionDelete.ind, 1);
			setInputList(list);
			setshowConditionModal(false);
		},
	});
	const [deleteRuleFun] = useMutation(DELETERULE, {
		update() {
			props.history.goBack();
		},
	});
	const [getrulesncond] = useLazyQuery(GETRULESANDCONDITIONS, {
		fetchPolicy: "network-only",
		onCompleted: (data) => {
			setInputList(data.getRuleConditions.conditions);
			setrule_data(data.getRuleConditions.rule_data);
			setprevData(data.getRuleConditions.rule_data);
			setprevListData(data.getRuleConditions.conditions);

			setisEditable(true);
			setloading(false);
		},
	});

	const [rulenNameonBlur, { loading: nameLoading }] = useMutation(
		RULENAMECHECK,
		{
			update(proxy, result) {
				let res = result.data.checkRuleName;
				if (res === true) {
					setrukenameStatus(true);
				} else {
					setrukenameStatus(false);
				}
			},
		}
	);

	useEffect(() => {
		let edit = localStorage.getItem("edit");
		let rule_id = localStorage.getItem("rule_id");

		if (edit === "true") {
			setloading(true);
			try {
				getrulesncond({
					variables: {
						mac_address: mac,
						component_id: component_id,
						rule_id: rule_id,
					},
				});
			} catch (error) {
				setloading(false);
			}
		}
		if (edit === "false") {
			setInputList([
				{
					condition_name: "",
					condition_name_other: "",
					color: "#91DAD8",

					condition: "",
					value: "",
				},
			]);
		}
	}, []);
	useEffect(() => {
		if (isEditable === true) {
			setshowEdit(true);
			setrData(rule_data);
		} else {
			setshowEdit(false);
		}
	}, [isEditable]);
	useEffect(() => {
		if (isEditable === true) {
			setrData(rule_data);
		}
	}, [rule_data]);
	// const handleInputChange = (e, index) => {
	// 	const { name, value } = e.target;
	// 	const list = [...inputList];
	// 	list[index][name] = value;
	// 	setInputList(list);
	// };

	const RemoveCondition = (li, index, rdta) => {
		let d = {
			id: li.condition_id,
			ind: index,
			rule_id: rdta.rule_id,
		};

		setindconditionDelete(d);
		if (isEditable === false) {
			const list = [...inputList];

			if (list.length === 1) {
				alert("Cannot delete this row");
			} else {
				list.splice(index, 1);
				setInputList(list);
			}
		} else {
			setshowConditionModal(true);
		}
	};
	const deleteConditionModal = async () => {
		setcircleModal(true);

		try {
			deleteCondition({
				variables: {
					mac_address: mac,
					component_id: component_id,
					rule_id: indconditionDelete.rule_id,
					condition_id: indconditionDelete.id,
				},
			});
		} catch (error) {
			setcircleModal(false);
		}
	};
	const DeleteRule = (dta) => {
		setshowRuleDeleteModal(true);
		setruleDataOnModalClick(dta);
	};
	const deleteRule = async () => {
		let rule_id = ruleDataOnModalClick.rule_id;

		setcircleModal(true);
		try {
			await deleteRuleFun({
				variables: {
					mac_address: mac,
					component_id: component_id,
					rule_id: rule_id,
				},
			});
		} catch (err) {
			setcircleModal(true);
		}
	};
	const handleAddClick = () => {
		setInputList([
			...inputList,
			{
				condition_name: "",
				condition_name_other: "",
				color: "#91DAD8",

				condition: "",
				value: "",
			},
		]);
	};
	const FormSubmit = async (e) => {
		setcircleLoading(true);

		if (e.rule_id) {
			try {
				await editData({ variables: { input: e } });
			} catch (err) {
				setcircleLoading(false);
			}
		} else {
			try {
				await saveData({ variables: { data: e } });
			} catch (err) {
				setcircleLoading(false);
			}
		}
	};
	const BackTORUles = () => {
		props.history.goBack();
	};
	const onCHangeCondition = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, condition: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};
	const onCHangeConditionName = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, condition_name: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};

	const onCHangeValue = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, value: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};

	const onCHangeMinSlider = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, Minimum_Condition: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};
	const onChangeMaxSlider = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, Maximum_Condition: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};
	const onCHangeRulename = (e) => {
		let name = e.target.name;
		let value = e.target.value;

		setrule_data((rule_data) => ({ ...rule_data, [name]: value }));
	};
	const onChangeColor = (e, ind) => {
		let val = e.target.value;

		const updatedInputHolder = inputList.map((obj, idx) => {
			if (idx === ind) {
				return { ...obj, color: val };
			}

			return obj;
		});

		setInputList(updatedInputHolder);
	};
	const EditConditions = () => {
		setshowEdit(false);
	};
	const ruleNameCHange = async (e) => {
		let d = e.target.value;
		setcheckRleRepeat(d);

		if (d === checkRleRepeat || checkRleRepeat === null) {
		} else {
			try {
				await rulenNameonBlur({
					variables: {
						component_id: component_id,
						mac_address: mac,
						rule_name: d,
					},
				});
			} catch (err) {}
		}
	};
	const CancelClick = () => {
		setshowEdit(true);
		setrData(prevData);
		setInputList(prevListData);
		setrukenameStatus(false);
		reset();
	};
	if (loading) {
		return <Loaders />;
	}
	const closeRuleModal = () => {
		setshowRuleDeleteModal(false);
	};
	const cloaseConditionModal = () => {
		setshowConditionModal(false);
	};

	const ViewRulesComp = () => {
		return (
			<div className="fs-2  textWithBack text-primary ml-5">View rules</div>
		);
	};
	const EditRuleComp = () => {
		return (
			<div className="fs-2  textWithBack text-primary ml-5">Edit rules</div>
		);
	};
	const CreateRuleComp = () => {
		return (
			<div className="fs-2  textWithBack text-primary ml-5">Create rules</div>
		);
	};
	return (
		<div>
			<div
				className={
					toggleSidebarState === "true" ? "fixedHead_shrink" : "fixedHead"
				}
			>
				<Back />

				{Object.keys(rData).length === 0 ? (
					<CreateRuleComp />
				) : showEdit === false ? (
					<EditRuleComp />
				) : (
					<ViewRulesComp />
				)}

				<div className="row">
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-3 ml-5 fs-5 text-muted">
						Setting rules with their conditions will help you create an
						efficient device monitoring. Create upto 3 conditions under each
						rule.
					</div>
				</div>
			</div>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<InputFileds
				inputList={inputList}
				handleAddClick={handleAddClick}
				RemoveCondition={RemoveCondition}
				register={register}
				errors={errors}
				handleSubmit={handleSubmit}
				FormSubmit={FormSubmit}
				Controller={Controller}
				control={control}
				onCHangeCondition={onCHangeCondition}
				onCHangeConditionName={onCHangeConditionName}
				onCHangeValue={onCHangeValue}
				onChangeColor={onChangeColor}
				onCHangeMinSlider={onCHangeMinSlider}
				onChangeMaxSlider={onChangeMaxSlider}
				component_id={component_id}
				circleLoading={circleLoading}
				BackTORUles={BackTORUles}
				isEditable={isEditable}
				rukenameStatus={rukenameStatus}
				rData={rData}
				onCHangeRulename={onCHangeRulename}
				ruleNameCHange={ruleNameCHange}
				EditConditions={EditConditions}
				showEdit={showEdit}
				reset={reset}
				CancelClick={CancelClick}
				nameLoading={nameLoading}
				DeleteRule={DeleteRule}
			/>
			<DeleteModalRule
				showRuleDeleteModal={showRuleDeleteModal}
				closeRuleModal={closeRuleModal}
				deleteRule={deleteRule}
				circleModal={circleModal}
			/>
			<DeleteConditionModal
				cloaseConditionModal={cloaseConditionModal}
				showConditionModal={showConditionModal}
				deleteConditionModal={deleteConditionModal}
				circleModal={circleModal}
			/>
		</div>
	);
}

export default CreateRule;
