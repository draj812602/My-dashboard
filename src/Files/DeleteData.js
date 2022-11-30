/** @format */

import delete_icon from '../Images/delete.png';

const DELETE_DASHBOARD = [
	{
		heading: 'Delete dashboard?',
		content:
			'Please rethink your decision because you will not be able to undo this action',

		buttons: [
			{
				name: 'Cancel',
				buttonAction: 'Cancel',
				classs: 'btn-secondary',
			},
			{
				name: 'Delete',
				buttonAction: 'Delete_dashboard',
				classs: 'btn-danger',
			},
		],
	},
];
const DELETE_MODAL = [
	{
		icon: delete_icon,
		heading: 'Delete widget?',
		content:
			'Please rethink your decision because you will not be able to undo this action.',

		buttons: [
			{
				name: 'Cancel',
				buttonAction: 'Cancel',
				classs: 'btn-secondary',
			},
			{
				name: 'Delete',
				buttonAction: 'Delete_widget',
				classs: 'btn-danger',
			},
		],
	},
];

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	DELETE_DASHBOARD,
	DELETE_MODAL,
};
