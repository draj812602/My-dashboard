import React from 'react';
import { CSVLink } from 'react-csv';

function ExportData(props) {
	return (
		<>
			<div className="d-flex">
				<CSVLink
					data={props.Exp_data}
					// headers={rawDataDevice?.getDeviceRawData?.columns}
					filename={props.Exp_file_name}
					className="btn btn-primary ml-auto mb-3 mr-1 raw_datatable_export_btn"
					title="Export as CSV / Excel">
					<span className="ri-external-link-line ri-lg mr-1 export_icon"></span>
					Export
				</CSVLink>
			</div>
		</>
	);
}

export default ExportData;
