import React, { useRef, useEffect } from 'react';

const CheckOutsideClick = (props) => {
	const ref = useRef(null);
	const { outSideClick, childeren } = props;

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			outSideClick && outSideClick();
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	if (!childeren) {
		return null;
	}

	return <div ref={ref}>{childeren}</div>;
};

export default CheckOutsideClick;
