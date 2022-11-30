export const styles = {
    control: (base) => ({
        ...base,
        '&:hover': { borderColor: '#5B4ADB' }, // border style on hover
        boxShadow: 'none', // no box-shadow
        borderColor: 'white',
    }),
    option: (styles, { isSelected }) => ({
        ...styles,
        '&:hover': { background: '#E8E8E8' }, // border style on hover
        boxShadow: 'none', // no box-shadow
        border: `1px solid #E8E8E8`,

    }),
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#C8EDEB',

    }),

}