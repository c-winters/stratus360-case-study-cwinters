class DomInterface {

    constructor() {
        this.prevButton = document.getElementById('prev')
        this.nextButton = document.getElementById('next')
        this.randomButton = document.getElementById('random')
        this.comicImage = document.getElementById('comic-image')
        this.comicTitle = document.getElementById('comic-title')
    }

    setComic(data){
        const {title, img} = data

        console.log("setting new comic")

        this.comicImage.src = img
        this.comicTitle.innerHTML = title
        //this.comicImage.alt = data.alt
    }

}

class RequestController {
    constructor() {
        this.DomInterface = new DomInterface();
        this.corsProxy = 'https://secret-river-48812.herokuapp.com'
        this.apiUrl = 'https://xkcd.com'
        this.apiUrlFormat = 'info.0.json'

        this.latestComicNumber = 0
        this.currentComicNumber = 0

        this.getLatestComic()
        this.addEventListeners()
    }

    setLatestComicNumber(number) {
        this.latestComicNumber = number
    }

    setCurrentComicNumber(number) {
        this.currentComicNumber = number
    }

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

    getComicByNumber(number){
        const requestUrl = `${this.corsProxy}/${this.apiUrl}/${number}/${this.apiUrlFormat}`
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                this.DomInterface.setComic(data)
                this.setCurrentComicNumber(data.num)
                console.log(this.currentComicNumber)
            })
    }

    getNextComic(){
        const nextComicNumber = this.currentComicNumber + 1

        if(nextComicNumber > this.latestComicNumber){
            return
        } else {
            this.getComicByNumber(nextComicNumber)
        }
    }

    getPreviousComic(){
        const prevComicNumber = this.currentComicNumber - 1
        
        if(prevComicNumber < 1){
            return
        } else {
            this.getComicByNumber(prevComicNumber)
        }     
    }

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









