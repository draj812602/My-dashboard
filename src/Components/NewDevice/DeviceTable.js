import React, { useContext, useEffect, useState, useRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import useWindowSizeHook from '../Utilites/getWindowSize';

import { useHistory } from 'react-router-dom';

import { DELETEDEVICE } from '../../Mutations';
import { GETDEVICE, GET_WIDGET_DATA } from '../../Queries';
import { useMutation } from '@apollo/react-hooks';
import DeleteModal from '../Modals/GlobalDeleteModal';

import { OverlayTrigger, Popover } from 'react-bootstrap';

import { GlobalContextMain } from '../../Context/GlobalContextOne';
import { useWidgetState, useWidgetDispatch } from '../../Context/WidgetContext';
import { useDashboardActiveState } from '../../Context/DashboardContext';
import ExportData from '../Utilites/ExportTableData';

const DeviceTable = (props) => {
	let history = useHistory();
	let { widgetData } = useWidgetState();
	const dispatch = useWidgetDispatch();
	let { dashboardList } = useDashboardActiveState();
	const context = useContext(GlobalContextMain);
	const [rowDataClicked, setrowDataClicked] = useState(null);
	const [showDeleteModal, setshowDeleteModal] = useState(false);
	const [columnData, setcolumnData] = useState(context.deviceTableData.column);
	const tempId = useRef(null);

	const [deleteDeviceFunc, { loading }] = useMutation(DELETEDEVICE, {
		update(proxy, result) {
			if (dashboardList.length > 0) {
				dashboardList.map((li) => {
					let data = proxy.readQuery({
						query: GET_WIDGET_DATA,
						variables: { dashboard_id: li.dashboard_id },
					});

					data.getWidget.widgets = data.getWidget.widgets.filter((te) => {
						return te.device_id !== tempId.current;
					});
				});
			}

			// proxy.writeQuery({
			// 	query: GET_WIDGET_DATA,
			// 	variables: { dashboard_id: activeDashboard.dashboard_id },
			// 	data,
			// });

			let newArray = {
				__typename: 'deviceTableData',
				column: context.deviceTableData.column,
				data: [],
			};
			context.deviceTableData.data.filter((l) => {
				if (l.device_id !== tempId.current) {
					newArray.data.push({
						device_id: l.device_id,
						device_identifier: l.device_identifier,
						device_name: l.device_name,
						device_status: l.device_status,
						template_id: l.template_id,
						device_template: l.device_template,
						__typename: 'deviceTable',
					});
				}
			});

			context.addDeviceClick(newArray);
			setshowDeleteModal(false);
		},
		// refetchQueries: [
		// 	{
		// 		query: GET_WIDGET_DATA,
		// 		variables: { dashboard_id: activeDashboard.dashboard_id },
		// 	},
		// ],
		// awaitRefetchQueries: true,
	});

	const DeleteButtonClickModal = async (dta) => {
		tempId.current = dta.device_id;

		try {
			await deleteDeviceFunc({
				variables: { device_id: tempId.current },
			});
		} catch (error) {
			setshowDeleteModal(false);
		}
	};

	const ShowDeleteModalFunc = () => {
		setshowDeleteModal(false);
	};
	useEffect(() => {
		let d = columnData.filter((li) => {
			return li.dataField !== 'options';
		});

		let c1 = {
			dataField: 'options',
			text: '',
			events: {
				onClick: (e, column, columnIndex, row, rowIndex) => {
					localStorage.setItem('dId', row.device_id);

					setrowDataClicked(row);
					setshowDeleteModal(true);
				},
			},
			editable: false,
			formatter: (rowIndex) => {
				return (
					<i
						className="ri-delete-bin-line ri-lg delete_rule"
						title="Current row will be deleted"></i>
				);
			},
		};

		d.push(c1);
		setcolumnData(d);
	}, []);

	const size = useWindowSizeHook();

	const deviceNameFun = (cell, row, rowIndex, formatExtraData) => {
		return (
			<span className="activeTableLink" onClick={() => onclickDeviceName(row)}>
				{row.device_name}
			</span>
		);
	};
	if (columnData) {
		// eslint-disable-next-line array-callback-return
		columnData.map((li) => {
			if (li.dataField === 'device_name') {
				li.formatter = deviceNameFun;
			}
		});
	}

	const onclickDeviceName = (row) => {
		history.push(
			`/Device/${row.device_name}780003a2-2b90-46d2-9af8-f58e9eb41e06${row.device_id}780003a2-2b90-46d2-9af8-f58e9eb41e06${row.template_id}`
		);
	};
	const collection = document.getElementsByClassName('table-responsive');

	const tableheight = size.height - 220;
	// console.log("testheight", tableheight)

	if (collection[0] !== undefined && collection[0] !== 'undefined') {
		collection[0].style.height = tableheight + 'px';
	}

	const table_data = context.deviceTableData.data?.filter((item) => {
		// console.log("data", item)
		return (
			item.device_identifier
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.device_name
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.device_status
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.device_template
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});
	const device_data_to_export = table_data?.map(
		({ device_id, template_id, __typename, ...ExportDeviceArray }) =>
			ExportDeviceArray
	);
	return (
		<div className="">
			<DeleteModal
				rowDataClicked={rowDataClicked}
				showDeleteModal={showDeleteModal}
				ShowDeleteModalFunc={ShowDeleteModalFunc}
				openIn={'Device'}
				DeleteButtonClickModal={DeleteButtonClickModal}
				loading={loading}
			/>
			<div>
				<ExportData
					Exp_data={device_data_to_export}
					Exp_file_name="Device_Info.csv"
				/>
				<BootstrapTable
					bootstrap4
					keyField="device_id"
					data={table_data}
					columns={columnData}
					wrapperClasses="table-responsive"
					classes="table-hover table-borderless"
					headerClasses="header-class"
					//selectRow={selectRow}
				/>
			</div>
		</div>
	);
};

export default DeviceTable;
