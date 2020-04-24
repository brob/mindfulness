import {pageBody} from '../showMindful';


function changeToHome() {
    const newHTML = `
        <h1>Be Mindful</h1>
        <p>Every day, you should strive to be more mindful. This app lets you focus on one thing each day to be mindful of. Login to get your first Mindful Mission</p>
        <button id="btn-login" onclick="login()">Log in</button>
    `
    pageBody.innerHTML = newHTML;
}


export { changeToHome }