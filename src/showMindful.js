const pageBody = document.querySelector('.mindful');

function setColors(backgroundColor, foregroundColor) {
    pageBody.style.setProperty('--background-color', backgroundColor);
    pageBody.style.setProperty('--foreground-color', foregroundColor);
}

function setWords(title, description, date) {
    const titleElem = document.querySelector('.topic__title');
    const timeElem = document.querySelector('.topic__date');
    const descElem = document.querySelector('.topic__description');

    const dateObj = new Date(date);
    let dateString = `${dateObj.toLocaleString('default', {weekday: 'long'})}, ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()}`
    
    titleElem.innerText = title;
    timeElem.innerText = dateString;
    descElem.innerText = description;
}

export { setColors, setWords, pageBody }