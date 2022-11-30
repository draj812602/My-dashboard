import React, { useState } from 'react';
import EmailView from '../../../Components/Modals/ViewEmailDetails';

function CviewEdit({ viewRuledata, EditClickCombRule, CancelClickCombRule }) {
	const [ShowViewEmailDetals, setShowViewEmailDetals] = useState(false);
	//console.log(viewRuledata);
	const vieeEmailModal = () => {
		setShowViewEmailDetals(true);
	};
	const closeEmailViewModal = () => {
		setShowViewEmailDetals(false);
	};

	return (
		<div>
			<EmailView
				ShowViewEmailDetals={ShowViewEmailDetals}
				closeEmailViewModal={closeEmailViewModal}
				Data={viewRuledata?.emailDat}
			/>

			<div className="row box_style no-gutters px-3 py-3 mt-5">
				<div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
					<div className="fs-6 pb-1 text-secondary">Combination Rule name</div>
					<div className="fs-5">{viewRuledata?.comb_rule_name}</div>
				</div>
			</div>
			<div className="box_style no-gutters px-3 py-3 mt-3">
				<div className="mb-3">
					<div className="fs-5">Conditions</div>
					<div className="colorLine"></div>
				</div>
				<div className="fs-6 pb-1 text-secondary">Trigger the rule if</div>
				<div className="fs-5">
					{viewRuledata?.trigger_operator === '||'
						? 'OR (if any one condition is true)'
						: 'AND(if all conditions are true)'}
				</div>

				{viewRuledata?.comb_rule_conditions.map((li, ind) => (
					<>
						<hr className="hrComView my-4" />
						<div className="row" key={ind}>
							<div className="col-12 col-sm-12 col-md-4 col-lg-3">
								<div className="fs-6 pb-1 text-secondary">Component</div>
								<div className="fs-5">{li.component_name}</div>
							</div>
							<div className="col-12 col-sm-12 col-md-4 col-lg-3">
								<div className="fs-6 pb-1 text-secondary">Rule</div>
								<div className="fs-5">{li.rule_name}</div>
							</div>
							<div className="col-12 col-sm-12 col-md-4 col-lg-3">
								<div className="fs-6 pb-1 text-secondary">Condition</div>
								<div className="fs-5">{li.condition_name}</div>
							</div>
						</div>
					</>
				))}
			</div>
			<div className="box_style px-3 py-3 mt-3">
				{viewRuledata?.emailCheckbox === true && (
					<div className="d-flex">
						<div>
							<div className="fs-5">Conditions</div>
							<div className="colorLine"></div>
							<div className="fs-5 mt-2">Email</div>
						</div>
						<div className="ml-auto">
							<button className="btn btn-link" onClick={vieeEmailModal}>
								View
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="btnAbsolute mr-4 pr-2">
				<button
					className="btn btn-danger mr-2 pb-2"
					type="button"
					onClick={CancelClickCombRule}>
					Cancel
				</button>
				<button
					className="btn btn-primary pb-2"
					type="button"
					onClick={EditClickCombRule}>
					Edit
				</button>
			</div>
		</div>
	);
}

export default CviewEdit;
