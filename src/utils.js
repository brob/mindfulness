function convertDate(dateInMs) {
    return new Date(dateInMs / 1000)
}
function checkCurrentDate(mindfulObj) {
    if (mindfulObj) {
        let today = new Date();
        let itemDate = new Date(mindfulObj.date);
        return today.getDate() === itemDate.getDate();
    }

    return false
}
function storeCurrent(currentItem) {
    window.localStorage.setItem('currentMindfulItem', JSON.stringify(currentItem));
}

export { checkCurrentDate, storeCurrent }