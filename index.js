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
        this.transcript = document.getElementById('transcript')
        this.loading = document.getElementById('loading')
        this.count = document.getElementById('count')
    }

    parseTranscript(transcript){
        return transcript.replace(/(?:\r\n|\r|\n)/g, '<br>')
            .replaceAll('[[', '<i>')
            .replaceAll(']]', '</i>')
            .replaceAll('{{', '<b>')
            .replaceAll('}}', '</b>')
            .replaceAll('((', '(')
            .replaceAll('))', ')')
    }

    // uses json from fetch to set element attributes
    setComic(data){
        // destructure json
        const {title, img, month, day, year, alt, num, transcript} = data
        // format the date
        const date = `${month}/${day}/${year}`
        // set element attributes
        this.loading.hidden = true
        this.comicImage.src = img
        this.comicTitle.innerHTML = title.toUpperCase()
        this.comicDate.innerHTML = date
        this.comicImage.alt = alt
        if(transcript == ""){
            this.transcript.innerText = ""
        } else {
            this.transcript.innerHTML = '<b>Transcript:</b><br><br>' + this.parseTranscript(transcript)
        } 
    }

    setPageCounter(number){
        this.count.innerHTML = 'Page views: ' + number
    }


}

// handles sending api requests, uses DomInterface to update the page
class RequestController {
    constructor() {

        this.DomInterface = new DomInterface();

        // used to send api requests using fetch
        this.corsProxy = 'https://secret-river-48812.herokuapp.com'
        this.xkcdApiUrl = 'https://xkcd.com'
        this.xkcdApiUrlFormat = 'info.0.json'
        this.countApiUrl = 'https://api.countapi.xyz'
        this.countApiHit = 'hit/cewinters'

        
        this.latestComicNumber = 0   // number corresponding to the most recent comic
        this.currentComicNumber = 0  // number corresponding to the current comic on page

        // grab url search params
        this.params = new URLSearchParams(window.location.search)

        // if there is a number param in url, use it to call for the corresponding comic
        if(this.params.has('number')){
            this.getLatestComic(false) // this must be called to set the latestComicNumber
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

    // uses count API to increase count for each page
    increaseCounter(number){
        const requestUrl = `${this.corsProxy}/${this.countApiUrl}/${this.countApiHit}/pp${number}`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => this.DomInterface.setPageCounter(data.value))
    }

    // sends request for the latest comic and displays it on page
    // false can be passed in to avoid putting the comic on the page and increasing its counter
    getLatestComic(setComic = true) {
        const requestUrl = `${this.corsProxy}/${this.xkcdApiUrl}/${this.xkcdApiUrlFormat}`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                this.setLatestComicNumber(data.num)
                if(setComic == true){
                    this.DomInterface.setComic(data)
                    this.increaseCounter(data.num)
                    this.setCurrentComicNumber(data.num)
                }
            })
    }

    // used to send request for a specific comic by corresponding number and displays it on the page
    getComicByNumber(number){
        const requestUrl = `${this.corsProxy}/${this.xkcdApiUrl}/${number}/${this.xkcdApiUrlFormat}`
        // used to update the url params to reflect the corresponding comic on page
        const currentUrl = window.location.href.split('?')[0]
        const stateObj = { Title :"Cyber City Comics", Url : `${currentUrl}?number=${number}`}
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                history.pushState(stateObj, stateObj.Title, stateObj.Url)
                this.DomInterface.setComic(data)
                this.increaseCounter(data.num)
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









