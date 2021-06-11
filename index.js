fetch('https://secret-river-48812.herokuapp.com/https://xkcd.com/info.0.json')
    .then(response => response.json())
    .then(data => console.log(data))