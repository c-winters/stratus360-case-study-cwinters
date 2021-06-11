// used to interface with the dom
class DomInterface {

    constructor() {
        // store elements
        this.prevButton = document.getElementById('prev')
        this.nextButton = document.getElementById('next')
        this.randomButton = document.getElementById('random')
        this.comicImage = document.getElementById('comic-image')
        this.comicTitle = document.getElementById('comic-title')
        this.comicDate = document.getElementById('comic-date')
    }

    // uses json from fetch to set element attributes
    setComic(data){
        // destructure json
        const {title, img, month, day, year, alt, num} = data
        // format the date
        const date = `${month}/${day}/${year}`
        // set element attributes
        this.comicImage.src = img
        this.comicTitle.innerHTML = title
        this.comicDate.innerHTML = date
        this.comicImage.alt = alt
        document.getElementById('title-cell').innerHTML = title
        document.getElementById('alt-cell').innerHTML = alt
        document.getElementById('num-cell').innerHTML = num
        document.getElementById('date-cell').innerHTML = date
        document.getElementById('img-url-cell').innerHTML = img
    }

}

// handles sending api requests, uses DomInterface to update the page
class RequestController {
    constructor() {

        this.DomInterface = new DomInterface();

        // used to send api requests using fetch
        this.corsProxy = 'https://secret-river-48812.herokuapp.com'
        this.apiUrl = 'https://xkcd.com'
        this.apiUrlFormat = 'info.0.json'
        
        this.latestComicNumber = 0   // number corresponding to the most recent comic
        this.currentComicNumber = 0  // number corresponding to the current comic on page

        // grab url search params
        this.params = new URLSearchParams(window.location.search)

        // if there is a number param in url, use it to call for the corresponding comic
        if(this.params.has('number')){
            this.getLatestComic() // this must be called to set the latestComicNumber
            this.getComicByNumber(this.params.get('number'))
        // else just call for the latest comic
        } else {
            this.getLatestComic()
        }

        this.addEventListeners()
    }

    setLatestComicNumber(number) {
        this.latestComicNumber = number
    }

    setCurrentComicNumber(number) {
        this.currentComicNumber = number
    }

    // sends request for the latest comic and displays it on page
    getLatestComic() {
        const requestUrl = `${this.corsProxy}/${this.apiUrl}/${this.apiUrlFormat}`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                this.DomInterface.setComic(data)
                this.setLatestComicNumber(data.num)
                this.setCurrentComicNumber(data.num)
            })
    }

    // used to send request for a specific comic by corresponding number and displays it on the page
    getComicByNumber(number){
        const requestUrl = `${this.corsProxy}/${this.apiUrl}/${number}/${this.apiUrlFormat}`
        // used to update the url params to reflect the corresponding comic on page
        const currentUrl = window.location.href.split('?')[0]
        const stateObj = { Title :"Cyber City Comics", Url : `${currentUrl}?number=${number}`}
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                history.pushState(stateObj, stateObj.Title, stateObj.Url)
                this.DomInterface.setComic(data)
                this.setCurrentComicNumber(data.num)
            })
    }

    // get the next comic based on the number of the current comic on page
    getNextComic(){
        const nextComicNumber = this.currentComicNumber + 1

        if(nextComicNumber > this.latestComicNumber){
            return
        } else {
            this.getComicByNumber(nextComicNumber)
        }
    }

    // get the previous comic based on the number of the current comic on page
    getPreviousComic(){
        const prevComicNumber = this.currentComicNumber - 1
        
        if(prevComicNumber < 1){
            return
        } else {
            this.getComicByNumber(prevComicNumber)
        }     
    }

    // get a random comic
    getRandomComic(){
        const randomNum = Math.floor(Math.random() * (this.latestComicNumber) + 1)
        this.getComicByNumber(randomNum)
    }

    addEventListeners() {
        this.DomInterface.nextButton.addEventListener('click', () => this.getNextComic())
        this.DomInterface.prevButton.addEventListener('click', () => this.getPreviousComic())
        this.DomInterface.randomButton.addEventListener('click', () => this.getRandomComic())
    }
}


const comic = new RequestController();
//prevButton.addEventListener(click, previousComic())
//nextButton.addEventListener(click, nextComic())
//randomButton.addEventListener(click, randomComic())









