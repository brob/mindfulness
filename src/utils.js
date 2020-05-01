function convertDate(dateInMs) {
    return new Date(dateInMs / 1000)
}
function checkCurrentDate(mindfulObj) {
    if (mindfulObj) {
        let today = new Date();
        let itemDate = new Date(mindfulObj.date);
        console.log(today, itemDate);
        return today.getDate() === itemDate.getDate();
    }

    return false
}
function storeCurrent(currentItem) {
    window.localStorage.setItem('currentMindfulItem', JSON.stringify(currentItem));
}
function buildCurrent(data) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    data.date = today;

    return data
}


export { checkCurrentDate, storeCurrent, buildCurrent }