/** @format */

import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Components/Navigation/Sidebar';
import history from './History/history';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Components/Router/routes';

import { GlobalProvider } from './Context/GlobalContext';
import { GlobalContextMainProvider } from './Context/GlobalContextOne';
import { GlobalContextMain } from './Context/GlobalContextOne';
import { DashboardActiveProvider } from './Context/DashboardContext';
import { WidgetProvider } from './Context/WidgetContext';

import Auth from './Context/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'remixicon/fonts/remixicon.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './Styles/TableCss.css';
import './Styles/global.css';
import './Styles/FormFields.css';
import './Scss/App.scss';
import './Styles/loader.css';

import NoMobiles from './Components/NotServingMobiles';

function App() {
	const auth = new Auth();
	const size = useWindowSizeHook();

	const [toggleSidebarstate, settoggleSidebarstate] = useState(
		localStorage.getItem('sidebarTstate') || false
	);
	const triggerSidebar = () => {
		settoggleSidebarstate(!toggleSidebarstate);
		localStorage.setItem('sidebarTstate', !toggleSidebarstate);
	};

	function useWindowSizeHook() {
		const [windowSize, setWindowSize] = useState({
			width: undefined,
			height: undefined,
		});
		useEffect(() => {
			// Handler to call on window resize
			function handleResize() {
				// Set window width/height to state
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
			// Add event listener
			window.addEventListener('resize', handleResize);
			// Call handler right away so state gets updated with initial window size
			handleResize();
			// Remove event listener on cleanup
			return () => window.removeEventListener('resize', handleResize);
		}, []); // Empty array ensures that effect is only run on mount
		return windowSize;
	}

	if (auth.isLoggedIn()) {
		return (
			<GlobalProvider>
				<GlobalContextMainProvider>
					<DashboardActiveProvider>
						<WidgetProvider>
							<Router history={history}>
								<div className="App wrapper bg">
									{size.width < 810 && size.height < 1080 ? (
										<div className="d-flex justify-content-center mt-5">
											<NoMobiles />
										</div>
									) : (
										<>
											<Routes toggleSidebarstate={toggleSidebarstate} />
											<Sidebar
												toggleSidebarstate={toggleSidebarstate}
												triggerSidebar={triggerSidebar}
											/>
										</>
									)}
								</div>
							</Router>
						</WidgetProvider>
					</DashboardActiveProvider>
				</GlobalContextMainProvider>
			</GlobalProvider>
		);
	} else {
		return null;
	}
}
export default App;
