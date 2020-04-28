import { setColors, setWords } from './showMindful'
import { checkCurrentDate, storeCurrent } from './utils'
import { getLatestFromFauna, getRandomMindfulFromFauna, storeMindfulInFauna } from './fauna'
import { currentUser } from './auth';

let currentMindful = window.localStorage.getItem('currentMindfulItem') ? JSON.parse(window.localStorage.getItem('currentMindfulItem')) : null;

function buildCurrent(fullData) {
    let data = fullData.data;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    data.date = today;
    data.ref = fullData.ref.value.id;

    return data
}


function render(mindfulObj) {
    const { title, description, date, color, textColor } = mindfulObj;

    setColors(color, textColor);
    setWords(title, description, date);
}
async function renderToday() {
    if (currentMindful && checkCurrentDate(currentMindful)) {
        render(currentMindful)
        return 
    } else {
        let fromFauna
        try {
            fromFauna = await getLatestFromFauna(currentUser);
        } catch (error) {
            console.error(error)
            fromFauna.error = error
        }
        if (fromFauna && !fromFauna.error && checkCurrentDate(fromFauna)) {
            storeCurrent(fromFauna);
            render(fromFauna);
        } else {
            let randomMindful = await getRandomMindfulFromFauna();
            let builtItem = buildCurrent(randomMindful)
            storeCurrent(builtItem);
            storeMindfulInFauna(builtItem);
            render(builtItem)
        }
        
        return
    }
}

export { render, renderToday }