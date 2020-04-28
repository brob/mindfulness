import createAuth0Client from '@auth0/auth0-spa-js';
import { renderToday } from './render';
import { changeToHome } from './layouts/home';
import { changeToMission } from './layouts/myMind';

let auth0 = null;
var currentUser = null;
const configureClient = async () => {
    auth0 = await createAuth0Client({
      domain: "mindfulness.auth0.com",
      client_id: "32i3ylPhup47PYKUtZGRnLNsGVLks3M6"
    });
};

const loadAuth = async () => {
    await configureClient();      
    
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        // show the gated content
        currentUser = await auth0.getUser();
        changeToMission();
        return;
    } else {
        changeToHome();
    }

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();
       
        currentUser = await auth0.getUser();
        changeToMission();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
}

const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
}
const logout = async () => {
    auth0.logout({
        returnTo: window.location.origin
    });
    window.localStorage.removeItem('currentMindfulItem')
    changeToHome();
}

export { auth0, loadAuth, currentUser, login, logout }