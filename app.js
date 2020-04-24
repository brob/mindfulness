import createAuth0Client from '@auth0/auth0-spa-js';
var faunadb = require('faunadb'),
q = faunadb.query;
const client = new faunadb.Client({ secret: "fnADqDZd9BACFNF3YrwId76AFmDbFwZ2OUnnVkp2" })

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
    const userObj = await auth0.getUser();

    console.dir(userObj.sub)
    renderToday();
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




function buildCurrent(data) {
    console.log('building current');
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    data.date = today;
    console.log(data)

    return data
}

function getRandomMindful() {

}

function storeCurrent(currentItem) {
    window.localStorage.setItem('currentMindfulItem', JSON.stringify(currentItem));
    // Push to database
}

function preRender() {
    // if (!currentMindful && !actualCurrent(getCurrent())) {
    //     console.log('in check for localstorage')

    //     storeCurrent(buildCurrent());
    //     return;
    // } 
    // if (!actualCurrent(currentMindful)) {
    //     console.log('in check for current date')
    //     storeCurrent(buildCurrent());
    //     return
    // }
    // console.log(currentMindful);
}

function checkCurrentDate(mindfulObj) {
    if (mindfulObj.date) {
        let today = new Date().setHours(0,0,0,0);
        let itemDate = new Date(mindfulObj.date).setHours(0, 0, 0, 0);
        console.log('in check for localstorage')    
        console.log(today, itemDate);    
        return today == itemDate;
    }

    return false
}

function render(mindfulObj) {
    const { title, description, date, color, textColor } = mindfulObj;

    setColors(color, textColor);
    setWords(title, description, date);
}
async function renderToday() {
    if (currentMindful && checkCurrentDate(currentMindful)) {
        console.log("check current date is true")
        render(currentMindful)
        return 
    } else {
        currentMindful = await getLatestFromFauna();
        console.log('current mindful set to latestfromfauna', currentMindful)
        if (checkCurrentDate(currentMindful)) {
            console.log('fauna time is today')
            storeCurrent(currentMindful);
            render(currentMindful);
        } else {
            
            console.log('fauna time is not today');
            let randomMindful = await getRandomMindfulFromFauna();
            let builtItem = buildCurrent(randomMindful.data)
            storeCurrent(builtItem);
            render(builtItem)
        }
        
        return
    }
}

async function getLatestFromFauna(userObj) {

    let latestFromFauna = await client.query(
        q.Call(
            q.Function("getLatestUserMindful"),
            "auth0|5e9f628439d9460ca08e8b86"
        )
    )
    console.log(latestFromFauna);
    return { date: latestFromFauna.latestTime, ...latestFromFauna.latestMindful }
}
async function getRandomMindfulFromFauna() {
    let mindfulThings = await client.query(
        q.Paginate(
            q.Documents(q.Collection('mindful_things'))
        )
    )
    
    let randomMindful = mindfulThings.data[Math.floor(Math.random()*mindfulThings.data.length)]
    return client.query(q.Get(randomMindful))
}
document.addEventListener('DOMContentLoaded', render)