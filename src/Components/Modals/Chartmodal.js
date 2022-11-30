import React from 'react';

import { Modal, Button } from 'react-bootstrap';
import Multilinechart from '../../d3/Charts/Multiline/MultilineChart';
import Barchartnew from '../../d3/Charts/BarChart/barchartnew';
import LineChartNew from '../../d3/Charts/LineChart/LineChartNew';
import Pie from '../../d3/Charts/PieChart/Newpiechart';
import { Charts } from '../../d3/Charts/Charts';
import { ChartsContainer } from '../../d3/Charts/ChartContainer';

function Chartmodal({
	chartModalClose,
	chartModalOpen,
	showModal,
	wameOnZoom,
	wameOnZoomData,
	multiLineColor,
}) {
	return (
		<div>
			<Modal
				size="xl"
				show={showModal}
				dialogClassName="chart_modal_class"
				backdrop="static"
				onHide={chartModalClose}>
				{/* <Modal.Body > */}
				<div className="mb-2 modal_header d-flex">
					<i
						className="ri-close-line ri-lg fs-4 ml-auto"
						onClick={chartModalClose}></i>
				</div>

				{wameOnZoom === 'ColumnChart' && (
					<Barchartnew data={wameOnZoomData} chartModalOpen={chartModalOpen} />
				)}
				{wameOnZoom === 'LineChart' && (
					<LineChartNew data={wameOnZoomData} chartModalOpen={chartModalOpen} />
				)}
				{wameOnZoom === 'GaugeChart' && (
					<ChartsContainer
						chartType={wameOnZoom}
						data={wameOnZoomData}
						chartModalOpen={chartModalOpen}
					/>
				)}

				{/* </Modal.Body> */}
			</Modal>
		</div>
	);
}

export default Chartmodal;
