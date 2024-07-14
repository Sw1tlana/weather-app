
function applyBodyBackground(cityName) {
    const imageUrl = `URL_для_зображення_${cityName}`; 
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.classList.add('body-with-background'); 
}


applyBodyBackground(cityName);