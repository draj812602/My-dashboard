import React, { useContext, useEffect, useState, useRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import useWindowSizeHook from '../Utilites/getWindowSize';
import { useHistory } from 'react-router-dom';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

import { DELETETEMPLATE } from '../../Mutations';
import { GETTEMPLATES, GETTEMPLATESLIST } from '../../Queries';
import { useMutation } from '@apollo/react-hooks';
import DeleteModal from '../Modals/GlobalDeleteModal';
import ExportData from '../Utilites/ExportTableData';

function TemplateTable() {
	let context = useContext(GlobalContextMain);

	const [selecteRowData, setselecteRowData] = useState([]);
	const [columnData, setcolumnData] = useState(
		context.templatetableData.column
	);

	const [rowDataClicked, setrowDataClicked] = useState(null);
	const [showDeleteModal, setshowDeleteModal] = useState(false);
	const tempId = useRef(null);

	let history = useHistory();
	// useEffect(() => {

	const [deleteTemplateFun, { loading }] = useMutation(DELETETEMPLATE, {
		update(proxy, result) {
			let data = proxy.readQuery({
				query: GETTEMPLATES,
			});

			let newArray = {
				__typename: 'templateTable',
				column: context.templatetableData.column,
				data: [],
			};
			context.templatetableData.data.filter((l) => {
				if (l.template_id !== tempId.current) {
					newArray.data.push({
						template_id: l.template_id,
						template_name: l.template_name,
						creation_date: l.creation_date,
						status: l.status,
						published_status: l.published_status,
						__typename: 'templateTableData',
					});
				}
			});
			// proxy.writeQuery({ query: GETTEMPLATES, data });

			context.createTemplateClick(newArray);

			setshowDeleteModal(false);
		},
		refetchQueries: [{ query: GETTEMPLATES }, { query: GETTEMPLATESLIST }],
		awaitRefetchQueries: true,
	});

	const DeleteButtonClickModal = async (dta) => {
		tempId.current = dta.template_id;

		try {
			await deleteTemplateFun({
				variables: { template_id: dta.template_id },
			});
		} catch (error) {
			console.log(error);
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
				onClick: async (e, column, columnIndex, row, rowIndex) => {
					setrowDataClicked(row);
					setshowDeleteModal(true);
				},
			},
			editable: false,
			formatter: () => {
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

	//console.log(selecteRowData);
	const size = useWindowSizeHook();
	const expandRow = {
		renderer: (row) => (
			<div>
				<PrettyJSOnRIghtPannel data={row.RawJsonObj} />
			</div>
		),
		showExpandColumn: true,
	};

	const PrettyJSOnRIghtPannel = ({ data }) => {
		// (destructured) data could be a prop for example
		return (
			<div>
				<pre className="text-dark">{JSON.stringify(data, null, 2)}</pre>
			</div>
		);
	};
	const deviceNameFun = (cell, row, rowIndex, formatExtraData) => {
		return (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<span
				className="activeTableLink"
				onClick={() => templateNameOcClick(row)}>
				{row.template_name}
			</span>
		);
	};
	if (columnData) {
		// eslint-disable-next-line array-callback-return
		columnData.map((li) => {
			if (li.dataField === 'template_name') {
				li.formatter = deviceNameFun;
			}
		});
	}

	const templateNameOcClick = (row) => {
		history.push(
			`Templates/${row.template_name}780003a2-2b90-46d2-9af8-f58e9eb41e06${row.template_id}`
		);
	};

	const collection = document.getElementsByClassName('table-responsive');

	const tableheight = size.height - 220;
	// console.log("testheight", tableheight)

	if (collection[0] !== undefined && collection[0] !== 'undefined') {
		collection[0].style.height = tableheight + 'px';
	}

	// columnData.push(c1);
	const table_data = context.templatetableData.data?.filter((item) => {
		return (
			item.template_name
				.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.published_status
				.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.status
				.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.creation_date
				.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});

	const temp_data_to_export = table_data?.map(
		({ template_id, __typename, ...ExportTempArray }) => ExportTempArray
	);

	return (
		<div>
			<DeleteModal
				rowDataClicked={rowDataClicked}
				showDeleteModal={showDeleteModal}
				ShowDeleteModalFunc={ShowDeleteModalFunc}
				DeleteButtonClickModal={DeleteButtonClickModal}
				loading={loading}
				heading={
					rowDataClicked &&
					rowDataClicked !== null &&
					rowDataClicked !== 'null' &&
					Object.entries(rowDataClicked)
				}
				openIn={'Template'}
			/>
			<ExportData
				Exp_data={temp_data_to_export}
				Exp_file_name="template_Info.csv"
			/>
			<BootstrapTable
				bootstrap4
				keyField="template_id"
				data={table_data}
				columns={columnData}
				wrapperClasses="table-responsive"
				classes="table-hover table-borderless"
				headerClasses="header-class"
			/>
		</div>
	);
}

export default TemplateTable;
