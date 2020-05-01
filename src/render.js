import { setColors, setWords } from './showMindful'
import { checkCurrentDate, storeCurrent, buildCurrent } from './utils'
import { getLatestFromFauna, getRandomMindfulFromFauna } from './fauna'
import { currentUser } from './auth';

let currentMindful = window.localStorage.getItem('currentMindfulItem') ? JSON.parse(window.localStorage.getItem('currentMindfulItem')) : null;

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
            console.log('from fauna')

            storeCurrent(fromFauna);
            render(fromFauna);
        } else {
            let newItem = await getRandomMindfulFromFauna(currentUser);
            let builtItem = await buildCurrent(newItem);
            
            storeCurrent(builtItem);
            render(builtItem);
            
        }
        
        return
    }
}

export { render, renderToday }