var word, guessWord
var lives = 7
var maxLives = 7
var score = 0
var state = 0
WORDS_LIST = JSON.parse(WORDS_LIST).words
// 0 menu
// 1 in game
// 2 inbetween

const sleep = ms => new Promise((a, b) => setTimeout(a, ms))

async function startRound(difficulty) {
	if(state != 0) return
	score = 0
	state = 1
	screenDiv.addEventListener("transitionend", () => {
		screenDiv.style.zIndex = -1
	}, { once: true })
	screenDiv.style.backgroundColor = "rgba(232, 232, 232, 0)"
	screenStartDiv.style.opacity = 0
	switch(difficulty) {
		case 1:
			lives = 7
			maxLives = 7
			break
		case 2:
			lives = 6
			maxLives = 6
			break
		case 3:
			lives = 5
			maxLives = 5
			break
	}
	updateTexts()
	selectWord()
}

function selectWord() {
	let res = WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]
	hint = res.hint.toLowerCase()
	word = res.word.toLowerCase()
	guessWord = word.replace(/[a-z]/g, "_")
	updateTexts()
}

function guess(e) {
	if(state != 1) return
	e = e.target || e
	if(e.classList.contains("correct") || e.classList.contains("incorrect")) return
	let result = []
	for(r of word.matchAll(e.innerHTML)) {
		result.push(r.index)
	}
	if(result.length == 0) incorrect(e)
	else correct(e, result)
}

async function correct(e, result) {
	e.addEventListener("transitionend", () => {
		e.style.transitionTimingFunction = "ease-in"
		e.style.transform = "scale(1, 1)"
	}, { once: true })
	e.classList.add("correct")
	for(r of result) {
		guessWord = guessWord.substring(0, r) + e.innerHTML + guessWord.substring(r + 1)
	}
	updateTexts()
	if(guessWord == word) {
		await win()
		lives = maxLives
		resetLetters()
		selectWord()
		updateTexts()
		state = 1
	}
}

async function incorrect(e) {
	e.addEventListener("transitionend", () => {
		e.style.transitionTimingFunction = "ease-in"
		e.style.transform = "scale(1, 1)"
	}, { once: true })
	e.classList.add("incorrect")
	lives--
	updateTexts()
	if(lives < 1) {
		await die()
		resetLetters()
		hint = "pick a difficulty"
		guessWord = "please"
		updateTexts()
		screenDiv.addEventListener("transitionend", () => {
			state = 0
		}, { once: true })
		screenDiv.style.backgroundColor = "rgba(232, 232, 232, 0.6)"
		screenStartDiv.style.opacity = 1
		screenDiv.style.zIndex = 2
	}
}

function resetLetters() {
	for(let e of lettersDiv.childNodes) {
		e.classList.remove("correct", "incorrect")
		e.style.transitionTimingFunction = "ease-out"
		e.style.transform = ""
	}
}

async function win() {
	state = 2
	score += lives
	updateTexts()
	new Audio("fireworks.wav").play()
	for(let i = 0; i < 200; i++) {
		spawnSprite(false)
		await sleep(10)
	}
	await sleep(3000)
	return
}

async function die() {
	state = 2
	guessWord = word
	if(JSON.parse(localStorage.getItem("scores"))[maxLives == 7 ? "easy" : maxLives == 6 ? "medium" : "hard"] < score) {
		let data = JSON.parse(localStorage.getItem("scores"))
		data[maxLives == 7 ? "easy" : maxLives == 6 ? "medium" : "hard"] = score
		localStorage.setItem("scores", JSON.stringify(data))
	}
	new Audio("explosion.wav").play()
	updateTexts()
	for(let i = 0; i < 120; i++) {
		spawnSprite(true)
		await sleep(5)
	}
	await sleep(4000)
	return
}

async function spawnSprite(isExplosion) {
	let explosion = document.createElement("div")
	explosion.classList.add(isExplosion ? "explosion" : "fireworks")
	explosion.style.left = `${window.innerWidth / 2 + (Math.random() * window.innerWidth - window.innerWidth / 2)}px`
	explosion.style.top = `${window.innerHeight / 2 + (Math.random() * window.innerHeight - window.innerHeight / 2)}px`
	if(!isExplosion) explosion.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`
	document.body.appendChild(explosion)
	if(isExplosion) {
		for(let i = 0; i < 16; i++) {
			explosion.style.backgroundPosition = `0px -${i * 160}px`
			await sleep(25)
		}
	} else {
		for(let i = 0; i < 16; i++) {
			explosion.style.backgroundPosition = `0px -${i * 40}px`
			await sleep(75)
		}
		await sleep(Math.random() * 800)
	}
	explosion.parentNode.removeChild(explosion)
}

function updateTexts() {
	hintDiv.innerHTML = hint
	guessDiv.innerHTML = guessWord
	remainingDiv.innerHTML = `${lives}/${maxLives}`
	highscoreDiv.innerHTML = `Score: ${score} - Best: ${maxLives == 10 ? 0 : JSON.parse(localStorage.getItem("scores"))[maxLives == 7 ? "easy" : maxLives == 6 ? "medium" : "hard"]}`
}

function resize() {
	remainingDiv.style.top = `${(guessDiv.getBoundingClientRect().bottom + lettersDiv.getBoundingClientRect().top) / 2.7}px`
}

var hintDiv, guessDiv, remainingDiv, lettersDiv, screenDiv, screenStartDiv, highscoreDiv

function load() {
	if(!localStorage.getItem("scores")) localStorage.setItem("scores", JSON.stringify({ easy: 0, medium: 0, hard: 0 }))
	hintDiv = document.getElementById("hint")
	guessDiv = document.getElementById("guess")
	remainingDiv = document.getElementById("remaining")
	lettersDiv = document.getElementById("letters")
	screenDiv = document.getElementById("screen")
	screenStartDiv = document.getElementById("screenStart")
	highscoreDiv = document.getElementById("highscore")
	for(let i = 97; i < 123; i++) {
		let div = document.createElement("div")
		div.classList.add("letter")
		div.id = String.fromCharCode(i)
		div.innerHTML = String.fromCharCode(i)
		div.onclick = guess.bind(this)
		lettersDiv.appendChild(div)
	}
	window.addEventListener("resize", resize)
	document.addEventListener("keydown", e => {
		let a = document.getElementById(e.key.toLowerCase())
		if(a) guess(a)
	})
	resize()
}
