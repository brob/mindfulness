const pageBody = document.querySelector('.mindful');

function setColors(backgroundColor, foregroundColor) {
    pageBody.style.setProperty('--background-color', backgroundColor);
    pageBody.style.setProperty('--foreground-color', foregroundColor);
    console.log(backgroundColor)
}

function setWords(title, description, date) {
    const titleElem = document.querySelector('.topic__title');
    const timeElem = document.querySelector('.topic__date');
    const descElem = document.querySelector('.topic__description');

    titleElem.innerText = title;
    timeElem.innerText = date;
    descElem.innerText = description;
}

export { setColors, setWords, pageBody }