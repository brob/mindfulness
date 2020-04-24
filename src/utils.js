import { storeMindfulInFauna } from "./fauna";

function checkCurrentDate(mindfulObj) {
    if (mindfulObj) {
        let today = new Date();
        let itemDate = new Date(mindfulObj / 1000);
        console.log(itemDate)
        console.log(today.getDate(), itemDate.getDate());    
        return today.getDate() === itemDate.getDate();
    }

    return false
}
function storeCurrent(currentItem) {
    window.localStorage.setItem('currentMindfulItem', JSON.stringify(currentItem));
}

export { checkCurrentDate, storeCurrent }