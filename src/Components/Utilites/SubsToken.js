import React, { useContext } from 'react';
import { GlobalContextMain } from '../../Context/GlobalContextOne';

const SubsToken = () => {
	const context = useContext(GlobalContextMain);
	return context.SubscriptionToken;
};

export default SubsToken;
