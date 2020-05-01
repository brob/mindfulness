import { getSomeFromFauna } from '../fauna';
import { changeToMission } from './myMind';

const itemCount = 5;
async function buildItems() {
    let latestMinds = await getSomeFromFauna(itemCount);

    let mindMarkup = latestMinds.map(item => {
        return `
            <article>
                <h3>${item.title}</h3>
                <p>${item.description}
            </article>
        `
    });
    return mindMarkup
}

async function thisWeek() {
    const pageBody = await document.querySelector('.mindful');
    const builtItems = await buildItems();
    console.log(builtItems);
    let newHTML = `
        <h2>Past ${builtItems.length} Missions</h2>
        ${await builtItems.join('')}
        <button id="show-mind">Back</button>
    `
    pageBody.innerHTML = newHTML;
    document.getElementById('show-mind').addEventListener('click', changeToMission);

}


export { thisWeek }