import React, { useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

let columnData = [
	{
		dataField: 'device_identifier',
		text: 'Device identifier',
		sort: true,
		__typename: 'ColumnData',
	},
	{
		dataField: 'device_name',
		text: 'Device name',
		sort: true,
		__typename: 'ColumnData',
	},
	{
		dataField: 'capability_name',
		text: 'Capability name', // display name here
		sort: true,
		__typename: 'ColumnData',
	},
	{
		dataField: 'message',
		text: 'Message',

		__typename: 'ColumnData',
	},
	{
		dataField: 'feedback_message',
		text: 'Feedback Message',

		__typename: 'ColumnData',
	},
];
let tableData = [
	{
		device_identifier: 'msrRVeChgJ',
		device_name: 'Telemetry',
		capability_name: 'Turn on fan',
		message: 'Some message',
		feedback_message: 'Success',
	},
	{
		device_identifier: '	oikPJwCSTX',
		device_name: 'Telemetry',
		capability_name: 'Command some message',
		message: 'Some message1',
		feedback_message: 'error',
	},
];

const HistoryTable = () => {
	const context = useContext(GlobalContextMain);

	const table_data = tableData.filter((item) => {
		return (
			item.device_identifier
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.device_name
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});

	return (
		<div className="mt-3">
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
	);
};

export default HistoryTable;
