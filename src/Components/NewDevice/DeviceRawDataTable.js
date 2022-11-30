import React, { useEffect, useState, useContext } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import useWindowSizeHook from '../Utilites/getWindowSize';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';
import ExportData from '../Utilites/ExportTableData';
import { useQuery } from '@apollo/react-hooks';

import { GETDEVICERAWDATA } from '../../Queries';

import { OverlayTrigger, Popover } from 'react-bootstrap';

import { GlobalContextMain } from '../../Context/GlobalContextOne';

import Loaders from '../Loader/Loader';

const DeviceRawDataTable = ({ device_id }) => {
	const context = useContext(GlobalContextMain);

	const [selecteRowData, setselecteRowData] = useState([]);
	const { loading: loadingRawData } = useQuery(GETDEVICERAWDATA, {
		variables: {
			device_id: device_id,
		},

		onCompleted: (data) => {
			context.setDeviceRawData(data.getDeviceRawData);
		},
		fetchPolicy: 'network-only',
	});

	const size = useWindowSizeHook();
	const expandRow = {
		renderer: (row) => (
			<div className="ml-3">
				<PrettyJSOnRIghtPannel data={row.RawJsonObj} />
			</div>
		),
		showExpandColumn: true,
	};

	const PrettyJSOnRIghtPannel = ({ data }) => {
		// (destructured) data could be a prop for example
		return (
			<div>
				<pre className="text-primary fs-7">{JSON.stringify(data, null, 2)}</pre>
			</div>
		);
	};

	const collection = document.getElementsByClassName('table-responsive');

	const tableheight = size.height - 260;
	// console.log("testheight", tableheight)

	if (collection[0] !== undefined && collection[0] !== 'undefined') {
		collection[0].style.height = tableheight + 'px';
	}

	const table_data = context?.DeviceRawData?.data?.filter((item) => {
		return (
			item.message_type
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			item.timestamp
				?.toLowerCase()
				.includes(context.globalSearchValue.toLowerCase()) ||
			!context.globalSearchValue
		);
	});
	const data_to_export = table_data?.map(
		({ raw_data_id, RawJsonObj, ...ExportArray }) => ExportArray
	);

	// console.log("EDITED data is", data_to_export);
	return (
		<div>
			{loadingRawData ? (
				<Loaders margin_top={20} />
			) : (
				context.DeviceRawData !== null && (
					<div>
						<ExportData
							Exp_data={data_to_export}
							Exp_file_name="Device_Info.csv"
						/>

						<BootstrapTable
							bootstrap4
							keyField="raw_data_id"
							data={table_data}
							columns={context.DeviceRawData?.columns}
							wrapperClasses="table-responsive"
							classes="table-hover table-borderless "
							headerClasses="header-class"
							//selectRow={selectRow}
							expandRow={expandRow}
						/>
					</div>
				)
			)}
		</div>
	);
};

export default DeviceRawDataTable;
