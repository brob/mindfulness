import {pageBody} from '../showMindful';
import {thisWeek} from './thisWeek';

function changeToMission() {
    console.log(pageBody);
    let newHTML = `
    <h1>Today's Mindful Mission</h1>
    <main class="mindful__topic" id="app">
        <h2 class="topic__title"></h2>
        <time class="topic__date"></time>
        <p class="topic__description"></p>
        <button id="show-recents">Show Past Missions</button>
        <button id="btn-logout" onclick="logout()">Log Out</button> 
    </main>
    `
    pageBody.innerHTML = newHTML;
    document.getElementById('show-recents').addEventListener('click', thisWeek);
}


export { changeToMission }