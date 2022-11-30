import React, { useEffect, useRef, useState } from 'react';
import {
	Accordion,
	useAccordionToggle,
	Card,
	OverlayTrigger,
	Tooltip,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../../Styles/modal_popover.css';

function MultiLineChart({
	selectedRulesToshow,
	setSelectedRulesToShow,
	compAndRules,
	setCompAndRules,
	selected_device,
	datasetData,
	loadingDevice,
}) {
	const [originalData, setOriginalData] = useState(null);
	const [data, setData] = useState(null);
	const [activeKey, setActiveKey] = useState(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showIconIndex, setShowIconIndex] = useState(null);
	const [onDelete, setOnDelete] = useState(false);
	const [colorForEachComp, setColorForEachComp] = useState(null);
	const [selectedCompsCount, setSelectedCompsCount] = useState(0);
	const [colorNode, setColorNode] = useState(null);
	const [loader, setLoader] = useState(true);
	const dropdownRef = useRef();
	let targetNode;
	const colorData = [
		{ comp_color_code: '#EE9B26' },
		{ comp_color_code: '#5CB85C' },
		{ comp_color_code: '#54B0CB' },
		{ comp_color_code: '#0D6EFD' },
		{ comp_color_code: '#6B5CDF' },
	];

	function CustomToggle({ children, eventKey, handleClick, index }) {
		const decoratedOnClick = useAccordionToggle(eventKey, () => {
			handleClick();
		});
		return (
			<div
				className="accord rounded"
				type="button"
				onClick={decoratedOnClick}
				onMouseEnter={() => {
					setShowIconIndex(index);
				}}
				onMouseLeave={() => {
					setShowIconIndex(null);
				}}>
				{children}
			</div>
		);
	}

	const onClickInput = (e) => {
		if (!showDropdown) {
			dropdownRef.current.style.display = 'block';
		} else {
			dropdownRef.current.style.display = 'none';
		}
		setShowDropdown(!showDropdown);
	};

	const handleRuleChange = (item, index, li, ind) => {
		if (selectedCompsCount < 5 || selectedRulesToshow[index] !== '') {
			let component_id = item.component_id;
			let rule_id = li.rule_id;
			let comp_color_code = '#000000';
			let dataset_name = item.dataset_name + '- ' + li.rule_name;

			let allArr = [...compAndRules];
			let selectedRuleRow = {
				...allArr[index],
				component_id,
				rule_id,
				comp_color_code,
			};
			allArr[index] = selectedRuleRow;
			setCompAndRules(allArr);

			let rulesToShowArr = [...selectedRulesToshow];
			let currentRule = [...rulesToShowArr[index]];
			currentRule = dataset_name;
			rulesToShowArr[index] = currentRule;
			setSelectedRulesToShow(rulesToShowArr);
			let c = 0;
			rulesToShowArr.forEach((li) => {
				if (li !== '') {
					c++;
				}
			});
			setSelectedCompsCount(c);
		} else {
			return toast.warning(
				'Can select upto max. of 5 components! Remove any one component to select this component.',
				{ autoClose: 3000 }
			);
		}
	};

	const deleteDatasetRule = (e) => {
		let index = e.target.id;
		let allArr = [...compAndRules];
		let selectedRuleRow = {
			...allArr[index],
		};
		selectedRuleRow = {};
		allArr[index] = selectedRuleRow;
		setCompAndRules(allArr);

		let colorsArr = [...colorForEachComp];
		colorsArr[index] = '';
		setColorForEachComp(colorsArr);
		let rulesToShowArr = [...selectedRulesToshow];
		let currentRule = [...rulesToShowArr[index]];
		currentRule = '';
		rulesToShowArr[index] = currentRule;
		setSelectedRulesToShow(rulesToShowArr);
		setActiveKey(null);
		setShowDropdown(false);
		setOnDelete(!onDelete);
		setSelectedCompsCount((prev) => prev - 1);
		dropdownRef.current.style.display = 'none';
	};

	const searchOption = (e) => {
		setActiveKey(null);
		let searchVal = e.target.value;
		if (searchVal !== '') {
			let searchedOptionsArr = [];
			data.forEach((ele) => {
				searchedOptionsArr.push('');
			});
			for (let i = 0; i < originalData.length; i++) {
				if (
					originalData[i].dataset_name
						.toLowerCase()
						.startsWith(searchVal.toLowerCase())
				) {
					searchedOptionsArr[i] = originalData[i];
				}
			}
			setData(searchedOptionsArr);
			for (let i = 0; i < data.length; i++) {
				if (document.getElementById(data[i].component_id)) {
					document.getElementById(data[i].component_id).style.backgroundColor =
						'#fff';
				}
			}
		} else {
			setData(originalData);
		}
	};

	const handleColorChange = (colorID, index) => {
		if (!compAndRules[index].rule_id) {
			return toast.error('Select the rule first!', { autoClose: 2000 });
		}
		if (
			!colorForEachComp.find((e) => e === colorID) ||
			colorForEachComp[index] === colorID
		) {
			let colorForEachCompCopy = JSON.parse(JSON.stringify(colorForEachComp));
			let compAndRulesCopy = JSON.parse(JSON.stringify(compAndRules));
			colorForEachCompCopy[index] = colorID;
			compAndRulesCopy[index].comp_color_code = colorID;
			setColorForEachComp(colorForEachCompCopy);
			setCompAndRules(compAndRulesCopy);
		} else {
			return toast.error("Can't use same color for more than one component!", {
				autoClose: 3000,
			});
		}
	};

	useEffect(() => {
		if (
			selected_device !== undefined &&
			selected_device !== '' &&
			datasetData !== undefined
		) {
			let selectedDeviceDatasets = datasetData.filter((li) => {
				return selected_device.label === li.device_name;
			});
			setOriginalData(selectedDeviceDatasets[0].device_dataset);
			setData(selectedDeviceDatasets[0].device_dataset);
		}
	}, [selected_device, datasetData]);

	useEffect(() => {
		let rulesArr = [];
		let rulesToShowArr = [];
		if (data) {
			data.forEach((ele) => {
				rulesArr.push({});
				rulesToShowArr.push('');
			});
			setCompAndRules(rulesArr);
			setSelectedRulesToShow(rulesToShowArr);
			setColorForEachComp(rulesToShowArr);
			setSelectedCompsCount(0);
			setLoader(false);
		}
	}, [originalData]);
	//console.log(colorForEachComp);
	useEffect(() => {
		if (data && colorForEachComp) {
			setColorNode(document.querySelectorAll('.colorBtn'));
		}
	}, [data, loader]);

	return (
		<div>
			<div
				className={
					!loadingDevice ? 'pr-5 input-bar' : 'pr-5 loading-input-bar'
				}>
				{selectedRulesToshow &&
					selectedRulesToshow.map((rule, id) => {
						return (
							rule !== '' && (
								<div key={id}>
									<div className="dataset_rule">
										<span style={{ color: '#636363' }} className="mr-1">
											{rule}
										</span>
										<i
											className="ri-close-line ri-lg"
											onClick={(e) => {
												deleteDatasetRule(e);
											}}
											id={id}
										/>
									</div>
								</div>
							)
						);
					})}
				{!loadingDevice && (
					<div
						className="show_dropdown_btn"
						onClick={(e) => {
							onClickInput(e);
						}}>
						<i
							className={
								//  "ri-arrow-up-s-line ri-xs"
								'ri-arrow-down-s-line ri-xs'
							}
						/>
					</div>
				)}
			</div>

			<div ref={dropdownRef} className="options-dropdown">
				{data && colorForEachComp && data.length !== 0 ? (
					<Accordion
						defaultActiveKey={0}
						activeKey={activeKey}
						style={{ height: '300px' }}>
						<input
							type="text"
							className="search-bar pt-1 pb-1 pl-2"
							onChange={searchOption}
							placeholder="search"
						/>
						<div style={{ height: '250px', overflow: 'auto' }}>
							{data.map((item, index) => {
								return (
									item !== '' && (
										<Card key={index}>
											<div>
												<Card.Body
													className="pl-4 pr-2 pt-2 pb-2 "
													id={item.component_id}>
													<CustomToggle
														eventKey={index.toString()}
														index={index}
														comps_length={data.length}
														handleClick={() => {
															if (activeKey === index.toString()) {
																setActiveKey(null);
																for (let i = 0; i < data.length; i++) {
																	if (
																		document.getElementById(
																			data[i].component_id
																		)
																	) {
																		document.getElementById(
																			data[i].component_id
																		).style.backgroundColor = '#fff';
																	}
																}
															} else {
																setActiveKey(index.toString());
																for (let i = 0; i < data.length; i++) {
																	if (
																		document.getElementById(
																			data[i].component_id
																		)
																	) {
																		document.getElementById(
																			data[i].component_id
																		).style.backgroundColor = '#fff';
																	}
																}
																document.getElementById(
																	item.component_id
																).style.backgroundColor = '#E8E8E8';
															}
														}}>
														<div className="row no-gutters">
															<div
																className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12
		                                    inputAsSelectOptions
		                                ">
																<i
																	className={
																		compAndRules[index]?.component_id ===
																			item.component_id ||
																		activeKey === index.toString()
																			? 'ri-checkbox-fill ri-lg'
																			: 'ri-checkbox-blank-line ri-lg'
																	}
																/>

																<div className="fs-4 ml-2">
																	{item.dataset_name}
																</div>
																{colorForEachComp[index] !== '' && (
																	<div
																		style={{
																			backgroundColor: colorForEachComp[index],
																		}}
																		className="color selectedColor"></div>
																)}
																{showIconIndex === index && (
																	<i
																		className={
																			activeKey === index.toString()
																				? 'ri-arrow-up-s-line ri-lg'
																				: 'ri-arrow-down-s-line ri-lg'
																		}
																		style={{ position: 'absolute', right: '0' }}
																	/>
																)}
															</div>
														</div>
													</CustomToggle>
												</Card.Body>
												<div className="collapse_body">
													<Accordion.Collapse eventKey={index.toString()}>
														<Card.Body className="p-0">
															<div className="row no-gutters inputAsSelectRuleContainer p-2 pl-4">
																{item.rules?.map((li, ind) => (
																	<div
																		key={ind}
																		className="col-12 col-s1-12 col-md-6 col-lg-6 col-xl-6">
																		<label
																			htmlFor={li.rule_name}
																			className="radio_label fs-4">
																			<input
																				type="radio"
																				m
																				id={li.rule_name}
																				name={item.component_id}
																				value={li.rule_id}
																				checked={
																					compAndRules[index]?.rule_id ===
																					li.rule_id
																				}
																				onChange={() =>
																					handleRuleChange(item, index, li, ind)
																				}
																			/>
																			<i></i>
																			<span> {li.rule_name}</span>
																		</label>
																	</div>
																))}
															</div>
															<div className="colorPaletteContainer">
																<div className="fs-6 modal_text">
																	Select Color
																</div>
																<div className="colorPalette">
																	{colorData.map((color, id) => {
																		return (
																			<div
																				key={color.comp_color_code}
																				className="color colorBtn"
																				style={{
																					backgroundColor:
																						color.comp_color_code,
																				}}
																				onMouseEnter={(e) => {
																					colorNode[
																						colorData.length * index + id
																					].children[0].style.display = 'block';
																				}}
																				onMouseLeave={(e) => {
																					colorNode[
																						colorData.length * index + id
																					].children[0].style.display = 'none';
																				}}
																				onClick={() => {
																					handleColorChange(
																						color.comp_color_code,
																						index
																					);
																				}}>
																				<div
																					style={{
																						backgroundColor:
																							color.comp_color_code,
																						border: `2px solid ${color.comp_color_code}80`,
																						outline: `${color.comp_color_code} solid 2px`,
																					}}
																					className="hoverColor"></div>
																			</div>
																		);
																	})}
																</div>
															</div>
														</Card.Body>
													</Accordion.Collapse>
												</div>
											</div>
										</Card>
									)
								);
							})}
						</div>
					</Accordion>
				) : (
					<Card className="p-2 mt-1 text-muted">
						<p style={{ margin: '0 auto' }}>No Options</p>
					</Card>
				)}
			</div>
		</div>
	);
}
export default MultiLineChart;
