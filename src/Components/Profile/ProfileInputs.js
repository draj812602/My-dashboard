import React, { useState } from "react";
import Auth from "../../Context/Auth";
import { useForm } from "react-hook-form";
import BasicInfoDefaultView from "../../Components/Profile/BasicInfo_DefaultView";
import BasicInfoEditFileds from "../../Components/Profile/BasicInfo_EditFileds";

const auth = new Auth().currentUser();

function ProfileInputs(props) {
    const [circleLoading, setcircleLoading] = useState(false);
	const { register, handleSubmit, errors, control, reset } = useForm();
	const [isEditable, setisEditable] = useState(false);
	const [EditInp, setEditInp] = useState(false);
	const [showEdit, setshowEdit] = useState(false);

	const onCHangeConditionName = (e, ind) => {
		let val = e.target.value;
	};

	const handleEdit = () => {
		setshowEdit(!showEdit);
	};
	const FormSubmit = async (e) => {
		setcircleLoading(false);
		setshowEdit(!showEdit);
		//console.log("after form submit", (e));
		//console.log(e);
		// if (e.rule_id) {
		// 	try {
		// 		await editData({ variables: { input: e } });
		// 	} catch (err) {
		// 		setcircleLoading(false);
		// 	}
		// } else {
		// 	try {
		// 		await saveData({ variables: { data: e } });
		// 	} catch (err) {
		// 		setcircleLoading(false);
		// 	}
		// }
	};

	return (
		<div>
			{showEdit ? (
				<BasicInfoEditFileds handleEdit={handleEdit} FormSubmit={FormSubmit} />
			) : (
				<BasicInfoDefaultView handleEdit={handleEdit} />
			)}
		</div>
	);
}

export default ProfileInputs;
