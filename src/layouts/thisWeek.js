import { currentUser } from '../auth';
import { getSomeFromFauna } from '../fauna';

const itemCount = 5;
async function buildItems() {
    let latestMinds = await getSomeFromFauna(currentUser, itemCount);
    console.log(latestMinds)
    let mindMarkup = latestMinds.map(item => {

        return `
            <article>
                <h3>${item.title}</h3>
            </article>
        `
    }).join('')
    return mindMarkup
}

async function thisWeek() {
    const pageBody = document.querySelector('.mindful');
    
    console.log(pageBody)
    let newHTML = `
        <h2>Past ${itemCount} Missions</h2>
        ${await buildItems()}
    `
    pageBody.innerHTML = newHTML;
}


export { thisWeek }