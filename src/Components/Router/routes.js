import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from '../../Context/Auth';
import Test from '../../View/Others/test';
import Test1 from '../../View/Others/test2';
import db from '../../Components/Dashboard/DashboardBar';
import myProfile from '../../Components/Profile/MyProfile';
import Device from '../../View/Device/Device';
import Device1 from '../../Components/Device/Device_register';
import DeviceInformation from '../../View/Device/DeviceDetails';
import Templates from '../../View/Templates/Templates';
import TemplatesDetails from '../../View/Templates/TemplateDetails';
import NotFound from '../../Components/Error/Pagenotfound';
import Rules from '../../View/Rules/Rules';
import CRules from '../../View/Rules/CombinationaRule/Cview';
import CreateRule from '../../View/Rules/CreateRule';
import ApiOverview from '../../View/Api/Overview';
import Docs from '../../View/Others/DocumentSite';
import UserProfile from '../../View/ProfilePages/UserProfile';
import CreateCapabilities from '../../View/Templates/TemplatesComponents';
import NewDashboard from '../../View/Dashboard/DashboardContainer';
import Overview from '../../View/Api/SubMenuFolder/Overview';
import Authentications from '../../View/Api/SubMenuFolder/Authentication';
import CommingSoon from '../../Components/Error/commingSoon';
const authnew = new Auth();
const auth = new Auth().isLoggedIn();
function Routes(props) {
    return (
        <div
            className={
                props.toggleSidebarstate === 'true' || props.toggleSidebarstate === true
                    ? 'main_content_shrink'
                    : 'main_content'
            }>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => {
                        return (
                            (auth === true || auth === false) && (
                                <Redirect to="/Device" component={Device} />
                            )
                        );
                    }}
                />
                <Route path="/dashboard1" component={db} />
                <Route path="/dashboard" component={NewDashboard} />
                {/* <Route path="/profile" component={myProfile} />*/}
                {/*<Route path="/dashboardcopy" component={DashboardCopy} />*/}
                <Route path="/test" component={Test} />
                <Route path="/test1" component={Test1} />
                <Route exact path="/Device" component={Device} />
                <Route exact path="/Templates" component={Templates} />
                <Route
                    exact
                    path="/Templates/:template_id"
                    component={TemplatesDetails}
                />
                <Route
                    path="/Templates/:template_id/:component_id"
                    component={CreateCapabilities}
                />
                <Route exact path="/device1" component={Device1} />
                <Route path="/profile" component={UserProfile} />
                <Route exact path="/device1/:mac_address" component={Rules} />
                <Route exact path="/Device/:device_id" component={DeviceInformation} />
                <Route
                    exact
                    path="/Device/:mac_address/trigger_rule/:c_rule_id"
                    component={CRules}
                />
                <Route
                    path="/Device/:mac_address/createrule/:component_id"
                    component={CreateRule}
                />
                <Route path="/docs" component={Docs} />
                <Route
                    path="/logout"
                    render={() => {
                        localStorage.removeItem('active_tab');
                        localStorage.removeItem('btoken');
                        localStorage.removeItem('SubsToken');
                        authnew.logout();
                    }}
                />
                {/*<div className="apiMainpage">
                    <Route exact={true} path="/Api" component={ApiOverview} />
                </div>*/}
                <Route path="/rules" component={CommingSoon} />
                <Route path="/help" component={CommingSoon} />
                <Route path="/*" component={NotFound} />
            </Switch>
        </div>
    );
}
export default Routes;