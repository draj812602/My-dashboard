import React from 'react';

function CombinationRuleNameCOntainer({ data, viewCombRUle, RemoveRule }) {
	return (
		<div>
			{data?.map((li, ind) => (
				<div className="row box_style no-gutters pl-3 py-3 mb-2" key={ind}>
					<div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
						<div className="fs-6 pb-1 text-secondary">
							Combination Rule name
						</div>
						<div className="fs-5">{li.comb_rule_name}</div>
					</div>
					<div
						className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pr-3"
						align="right">
						<button
							type="button"
							className="btn btn-light mr-2"
							onClick={() => viewCombRUle(li.comb_rule_id)}>
							View rule
						</button>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => RemoveRule(li.comb_rule_id)}>
							Remove
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

export default CombinationRuleNameCOntainer;
