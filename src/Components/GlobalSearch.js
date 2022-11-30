import React from 'react';

function GlobalSearch({ searchData, searchFor }) {
	return (
		<div className="mx-4 mt-1">
			<div className="d-flex">
				<i className="ri-information-line mr-2 ri-2x text-danger"></i>
				<div className="d-flex flex-column searchContainer">
					<div className="fs-3 ">No result for "{searchData}"</div>
					<div className="fs-7 mt-2">
						Please check your {searchFor} you are looking for.
					</div>
				</div>
				<br />
			</div>
		</div>
	);
}

export default GlobalSearch;
