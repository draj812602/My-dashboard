import React, { useState, useContext, useEffect, useRef } from 'react';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

function SearchBar({ props, placeholderName, setSearchState }) {
	const context = useContext(GlobalContextMain);

	const [closebtn, setclosebtn] = useState(false);

	const resetInput = () => {
		context.globalsearchOnchange('');
		setclosebtn(false);
	};

	const search_trigger = (e) => {
		context.globalsearchOnchange(e.target.value);

		let trigger_value = e.target.value;

		trigger_value !== '' ? setclosebtn(true) : setclosebtn(false);
	};
	useEffect(() => {
		context.globalsearchOnchange('');
		setclosebtn(false);
	}, []);

	return (
		<>
			<input
				type="search"
				placeholder={placeholderName}
				value={context.globalSearchValue}
				className="form-control"
				onChange={search_trigger}
			/>
			<span className="fa fa-search"></span>
			{closebtn && (
				<button
					class="closesearchbtn ri-lg ri-close-line"
					onClick={resetInput}></button>
			)}
		</>
	);
}

export default SearchBar;
