import createAuth0Client from '@auth0/auth0-spa-js';
import { changeToHome } from './layouts/home'; // Home Layout
import { changeToMission } from './layouts/myMind'; // Current Mindfulness Mission Layout

let auth0 = null;
var currentUser = null;
const configureClient = async () => {
    // Configures Auth0 SDK
    auth0 = await createAuth0Client({
      domain: "mindfulness.auth0.com",
      client_id: "32i3ylPhup47PYKUtZGRnLNsGVLks3M6"
    });
};

const checkUser = async () => {
    // return user info from any method
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        return await auth0.getUser();
    }
}

const loadAuth = async () => {
    // Loads and checks auth
    await configureClient();      
    
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
        // show the gated content
        currentUser = await auth0.getUser();
        changeToMission(); // Show the "Today" screen
        return;
    } else {
        changeToHome(); // Show the logged out "homepage"
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
    changeToHome(); // Change back to logged out state
}

export { auth0, loadAuth, currentUser, checkUser, login, logout }