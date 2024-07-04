const fetchButton = document.getElementById('fetch-button')

function getApi() {
    const requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}';

fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for (let i = 0; i < data.lenght; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = data[i].html_url;
            repoList.appendChild(listItem);
        }
    });
}

fetchButton.addEventListener('click', getApi);