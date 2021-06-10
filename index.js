fetch('https://xkcd.com/info.0.json')
    .then(response => response.JSON)
    .then(data => console.log(data))