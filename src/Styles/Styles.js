const styles = {
	control: (base, { isDisabled }) => ({
		...base,
		color: 'white',
		cursor: 'pointer',
		'&:hover': { borderColor: '#bac3d5' },
		boxShadow: 'none',
		backgroundColor: isDisabled ? '#f2f2f2' : '#b8c3d7',
		borderRadius: '6px',
		height: '38px',
	}),
	dropdownIndicator: (base, { isDisabled }) => ({
		...base,

		color: isDisabled ? '#b8c3d7' : 'white',

		backgroundColor: isDisabled ? '#f2f2f2' : '#41506b',
		padding: '8.5px',
		borderRadius: '6px',
	}),
	placeholder: (defaultStyles, { isDisabled }) => {
		return {
			...defaultStyles,

			color: isDisabled ? '#b8c3d7' : 'white',
		};
	},
	option: (styles, { isSelected }) => ({
		...styles,
		'&:hover': { background: 'rgba(217, 233, 255)' },
		boxShadow: 'none',
		cursor: 'pointer',

		border: 'none',

		backgroundColor: isSelected ? '#b8c3d7' : 'white',
	}),

	multiValue: (styles) => ({
		...styles,
		backgroundColor: '#C8EDEB',
	}),
};
export default styles;
