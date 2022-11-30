import React from 'react';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const PureBreadcrumbs = ({ breadcrumbs, key }) => (
	<div className="breadcrumbs text">
		{breadcrumbs.map(({ breadcrumb, match }, index) => (
			<div className="bc fs-6 " key={match.url.split('-')[0] + ':' + index}>
				{index + 1 === breadcrumbs.length ? (
					<span className="breadcrumactive">
						{
							breadcrumb.props.children.split(
								'780003a2-2b90-46d2-9af8-f58e9eb41e06'
							)[0]
						}
						{/* {console.log("test", breadcrumb.props.children.split('-')[0])} */}
					</span>
				) : (
					// <span className="breadcrumactive">
					// {/* <Link to={match.url || ''}>{breadcrumb}</Link> */ }
					<Link className="breadcrumbschild" to={match.url || ''}>
						{
							breadcrumb.props.children.split(
								'780003a2-2b90-46d2-9af8-f58e9eb41e06'
							)[0]
						}
					</Link>

					// </span>
				)}
				{index < breadcrumbs.length - 1 && '>'}
			</div>
		))}
	</div>
);

export default withBreadcrumbs([
	{
		path: '/',
		breadcrumb: null,
	},
])(PureBreadcrumbs);
