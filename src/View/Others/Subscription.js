import React from 'react';
import Auth from '../../Context/Auth';

const auth = new Auth().currentUser();
let sidebarToggle = localStorage.getItem('sidebarTstate');

var data = [
	{
		tierName: 'Basic',
		tierPrice: 'Free',
		tierDescription:
			'The perfect way to get started & get used to our services.',
		features: [
			{
				feature1: 'Featur1',
				feature2: 'Featur2',
				feature3: 'Featur3',
				feature4: 'Featur4',
				feature5: 'Featur5',
			},
		],
		subscribedStatus: true,
	},
	// {
	//     tierName: 'Tier 1',
	//     tierPrice: '$50',
	//     tierDescription: 'The perfect way to get started & get used to our services.',
	//     features: [
	//         {
	//             feature1: 'Featur1',
	//             feature2: 'Featur2',
	//             feature3: 'Featur3',
	//             feature4: 'Featur4',
	//             feature5: 'Featur5',
	//         },
	//     ],
	//     subscribedStatus: false,
	// },
	// {
	//     tierName: 'Tier 2',
	//     tierPrice: '$100',
	//     tierDescription: 'The perfect way to get started & get used to our services.',
	//     features: [
	//         {
	//             feature1: 'Featur1',
	//             feature2: 'Featur2',
	//             feature3: 'Featur3',
	//             feature4: 'Featur4',
	//             feature5: 'Featur5',
	//         },
	//     ],
	//     subscribedStatus: false,
	// },
	// {
	//     tierName: 'Tier 2',
	//     tierPrice: '$100',
	//     tierDescription: 'The perfect way to get started & get used to our services.',
	//     features: [
	//         {
	//             feature1: 'Featur1',
	//             feature2: 'Featur2',
	//             feature3: 'Featur3',
	//             feature4: 'Featur4',
	//             feature5: 'Featur5',
	//         },
	//     ],
	//     subscribedStatus: false,
	// },
];

function SubscriptionView(props) {
	return (
		<>
			<div className="row no-gutters">
				{data.map((li, ind) => {
					return (
						<div className=" no-gutters col-12 col-sm-12 col-md-4 col-lg-3 col-xl-2">
							<div className="col-11 col-sm-11 col-md-12 col-lg-12 col-xl-12 mt-3 subscription_box">
								<div className=" box_style subscription_view px-3 py-2 col-12 col-md-11 col-lg-11 col-xl-11 ">
									<div className="fs-5 subscrib_text">{li.tierName}</div>
									<div className="fs-3 subscrib_text">{li.tierPrice}</div>
									<div className="text-muted fs-9 mt-2 subscrib_text">
										{li.tierDescription}
									</div>
									<hr className="mb-4 "></hr>
									{li.features.map((li, i) => {
										return (
											<>
												<div className="text_list subscrib_text">
													<span className="ri-check-line ri-lg conected_text"></span>
													<div className="sub_text_class  fs-7 mb-3">
														{li.feature1}
													</div>
													<span className="ri-check-line ri-lg conected_text"></span>
													<div className="sub_text_class  fs-7 mb-3">
														{li.feature2}
													</div>
													<span className="ri-check-line ri-lg conected_text"></span>
													<div className="sub_text_class  fs-7 mb-3">
														{li.feature3}
													</div>
													<span className="ri-check-line ri-lg conected_text"></span>
													<div className="sub_text_class  fs-7 mb-3">
														{li.feature4}
													</div>
													<span className="ri-check-line ri-lg conected_text"></span>
													<div className="sub_text_class  fs-7 mb-3">
														{li.feature5}
													</div>
												</div>
											</>
										);
									})}
									{li.subscribedStatus === true ? (
										<div className="btn btn-primary col-lg-12 mt-3 mb-3 subscrib_text">
											Subscribed
										</div>
									) : (
										<div className="btn btn-primary col-lg-12 mt-3 mb-3 subscrib_text">
											Get Started
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default SubscriptionView;
