import { setColors, setWords } from './showMindful'
import { checkCurrentDate, storeCurrent } from './utils'
import { getLatestFromFauna, getRandomMindfulFromFauna } from './fauna'
import { currentUser } from './auth';



let currentMindful = window.localStorage.getItem('currentMindfulItem') ? JSON.parse(window.localStorage.getItem('currentMindfulItem')) : null;

function buildCurrent(fullData) {
    console.log('building current');
    
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
    if (currentMindful && checkCurrentDate(currentMindful.date * 1)) {
        console.log("check current date is true")
        render(currentMindful)
        return 
    } else {
        const fromFauna = await getLatestFromFauna(currentUser);
        console.log('current mindful set to latestfromfauna', fromFauna)
        console.log(fromFauna);
        if (checkCurrentDate(fromFauna.date)) {
            console.log('fauna time is today')
            storeCurrent(fromFauna);
            render(fromFauna);
        } else {
            console.log('fauna time is not today');
            let randomMindful = await getRandomMindfulFromFauna();
            let builtItem = buildCurrent(randomMindful)
            storeCurrent(builtItem);
            storeMindfulInFauna(currentItem);
            render(builtItem)
        }
        
        return
    }
}

export { render, renderToday }