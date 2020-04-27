import { currentUser } from '../auth';
import { getSomeFromFauna } from '../fauna';
import { changeToMission } from './myMind';

const itemCount = 5;
async function buildItems() {
    let latestMinds = await getSomeFromFauna(currentUser, itemCount);
    let mindMarkup = latestMinds.map(item => {
        return `
            <article>
                <h3>${item.title}</h3>
                <p>${item.description}
            </article>
        `
    }).join('')
    return mindMarkup
}

async function thisWeek() {
    const pageBody = await document.querySelector('.mindful');
    let newHTML = `
        <h2>Past ${itemCount} Missions</h2>
        ${await buildItems()}
        <button id="show-mind">Back</button>
    `
    pageBody.innerHTML = newHTML;
    document.getElementById('show-mind').addEventListener('click', changeToMission);

}


export { thisWeek }