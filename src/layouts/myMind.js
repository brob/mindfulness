import {pageBody} from '../showMindful';


function changeToMission() {
    console.log(pageBody)
    let newHTML = `
    <h1>Today's Mindful Mission</h1>
    <main class="mindful__topic" id="app">
        <h2 class="topic__title"></h2>
        <time class="topic__date"></time>
        <p class="topic__description"></p>
    </main>
    `
    pageBody.innerHTML = newHTML;
}


export { changeToMission }