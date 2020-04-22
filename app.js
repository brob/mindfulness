import createAuth0Client from '@auth0/auth0-spa-js';

let auth0 = null;
const configureClient = async () => {
    auth0 = await createAuth0Client({
      domain: "mindfulness.auth0.com",
      client_id: "32i3ylPhup47PYKUtZGRnLNsGVLks3M6"
    });
};

const updateUI = async () => {
    const isAuthenticated = await auth0.isAuthenticated();
  
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
};
window.login = async () => {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
};


window.onload = async () => {
    await configureClient();
   
  updateUI();

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    // show the gated content
    console.log(await auth0.getUser());
    return;
  }

  // NEW - check for the code and state parameters
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {

    // Process the login state
    await auth0.handleRedirectCallback();
    
    updateUI();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
};
const MINDFUL_THINGS = [
    {
        "title": "This is the first mindful object",
        "description": "This is the description for the first mindful object",
        "color": "blue",
        "textColor": "white",
        "ref": "string"
    },
    {
        "title": "This is the second mindful object",
        "description": "This is the description for the first mindful object",
        "color": "green",
        "textColor": "black",
        "ref": "string"

    }
]
const MY_MIND = [
    {
        "ref": "faunastring-mindful-object",
        "user": "auth0|user",
        "date": "fauna_ts"
    }
]

const app = document.getElementById('app');
const pageBody = document.querySelector('.mindful');

let currentMindful = window.localStorage.getItem('currentMindfulItem') ? JSON.parse(window.localStorage.getItem('currentMindfulItem')) : null;
console.log(currentMindful);

function setColors(backgroundColor, foregroundColor) {
    pageBody.style.setProperty('--background-color', backgroundColor);
    pageBody.style.setProperty('--foreground-color', foregroundColor);
    console.log(backgroundColor)
}

function setWords(title, description, date) {
    const titleElem = document.querySelector('.topic__title');
    const timeElem = document.querySelector('.topic__date');
    const descElem = document.querySelector('.topic__description');

    titleElem.innerText = title;
    timeElem.innerText = date;
    descElem.innerText = description;
}

function actualCurrent(currentItem) {
    //Check date
    console.log(currentItem)
    let today = new Date().setHours(0,0,0,0);
    let itemDate = new Date(currentItem.date).setHours(0, 0, 0, 0);
    console.log(today, itemDate);
    return today == itemDate
}

function getCurrent() {

    return MY_MIND.filter(item => item.isCurrent)[0]
}

function buildCurrent() {
    const newMindful = MINDFUL_THINGS[Math.floor(Math.random()*MINDFUL_THINGS.length)];
    console.log('building current');
    console.dir(newMindful);
    newMindful.isCurrent = true;
    newMindful.date = new Date().setHours(0, 0, 0, 0);
    console.dir(newMindful);

    MY_MIND.unshift(newMindful);
    return newMindful
}

function storeCurrent(currentItem) {
    window.localStorage.setItem('currentMindfulItem', JSON.stringify(currentItem));
    // Push to database

}

function preRender() {
    if (!currentMindful && !actualCurrent(getCurrent())) {
        console.log('in check for localstorage')

        storeCurrent(buildCurrent());
        return;
    } 
    if (!actualCurrent(currentMindful)) {
        console.log('in check for current date')
        storeCurrent(buildCurrent());
        return
    }
    console.log(currentMindful);
}



function render() {
    preRender();
    const { title, description, date, color, textColor } = currentMindful;

    setColors(color, textColor);
    setWords(title, description, date);
}


document.addEventListener('DOMContentLoaded', render)