import createAuth0Client from '@auth0/auth0-spa-js';
import { renderToday } from './render';
import { changeToHome } from './layouts/home';
import { changeToMission } from './layouts/myMind';

let auth0 = null;
let currentUser = null;
const configureClient = async () => {
    auth0 = await createAuth0Client({
      domain: "mindfulness.auth0.com",
      client_id: "32i3ylPhup47PYKUtZGRnLNsGVLks3M6"
    });
};

const loadAuth = async () => {
     await configureClient();
       
      authUpdateUI();
    
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        // show the gated content
        currentUser = await auth0.getUser();
        console.log(currentUser)
        changeToMission();
        renderToday();
        return;
    }

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state
        await auth0.handleRedirectCallback();
        changeToMission();
       
        authUpdateUI();
        renderToday();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
}

const authUpdateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
};

const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    });
}
const logout = async () => {
    auth0.logout({
        returnTo: window.location.origin
    });
    changeToHome();
}

export { auth0, loadAuth, currentUser, authUpdateUI, login, logout }