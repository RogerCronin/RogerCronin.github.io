let word, guessWord
let lives = 7
let maxLives = 7
let score = 0
// 0 menu
// 1 in game
// 2 inbetween
// 3 leaderboard input
// 4 waiting for leaderboard
let state = 0

let wordIndex = 0

WORDS_LIST = JSON.parse(WORDS_LIST).words

const letterSprites = {
	p: [
		[true,  true,  true ],
		[true,  false, true ],
		[true,  true,  false],
		[true,  false, false],
		[true,  false, false]
	],
	e: [
		[true,  true,  true ],
		[true,  false, false],
		[true,  true,  false],
		[true,  false, false],
		[true,  true,  true ]
	],
	r: [
		[true,  true,  true ],
		[true,  false, true ],
		[true,  true,  false],
		[true,  false, true ],
		[true,  false, true ]
	],
	f: [
		[true,  true,  true ],
		[true,  false, false],
		[true,  true,  false],
		[true,  false, false],
		[true,  false, false]
	],
	c: [
		[true,  true,  true ],
		[true,  false, false],
		[true,  false, false],
		[true,  false, false],
		[true,  true,  true ]
	],
	t: [
		[true,  true,  true ],
		[false, true,  false],
		[false, true,  false],
		[false, true,  false],
		[false, true,  false]
	]
}

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
	wordIndex = Math.floor(Math.random() * WORDS_LIST.length)
	let res = WORDS_LIST[wordIndex]
	hint = res.hint.toLowerCase()
	word = res.word.toLowerCase()
	guessWord = word.replace(/[a-z]/g, "_")
	updateTexts()
}

function guess(e) {
	if(state == 3) return leaderboardInput(e)
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
		if(state == 3) return
		resetLetters()
		hint = "hangman"
		guessWord = "_____"
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
		e.classList.remove("correct", "incorrect", "pressed")
		e.style.transitionTimingFunction = "ease-out"
		e.style.transform = ""
	}
}

async function win() {
	state = 2
	score += lives
	new Audio("./assets/fireworks.wav").play()
	if(lives == maxLives) {
		await spawnPerfect()
	} else {
		for(let i = 0; i < 200; i++) {
			spawnPixel(false, randomPos(false), randomPos(true))
			await sleep(10)
		}
		await sleep(3000)
	}
	updateTexts()
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
	new Audio("./assets/explosion.wav").play()
	updateTexts()
	for(let i = 0; i < 120; i++) {
		spawnPixel(true, randomPos(false), randomPos(true))
		await sleep(5)
	}
	await sleep(4000)
	if(maxLives == 5 && score > leaderboardHigh && useLeaderboard) {
		handleLeaderboard()
	}
	return
}

function updateTexts() {
	hintDiv.innerHTML = hint
	guessDiv.innerHTML = guessWord

	if(guessWord) {
		let longest = Math.max(...guessWord.split(" ").map(i => i.length), 10)
		document.querySelector(":root").style.setProperty("--guessSize", `${100 / longest * 0.95}vw`)
	}

	remainingDiv.innerHTML = `${lives}/${maxLives}`
	highscoreDiv.innerHTML = `Score: ${score} - Best: ${maxLives == 10 ? 0 : JSON.parse(localStorage.getItem("scores"))[maxLives == 7 ? "easy" : maxLives == 6 ? "medium" : "hard"]}`
}

function resize() {
	lettersDiv.style.top = `${window.innerHeight * 0.97 - lettersDiv.clientHeight}px`
	remainingDiv.style.top = `${(guessDiv.getBoundingClientRect().bottom + lettersDiv.getBoundingClientRect().top) / 2.7}px`
}

let hintDiv, guessDiv, remainingDiv, lettersDiv, screenDiv, screenStartDiv, highscoreDiv, screenLeaderboard

function load() {
	new Image().src = "./assets/fireworks.png"
	new Image().src = "./assets/explosion.png"
	new Audio("./assets/fireworks.wav")
	new Audio("./assets/explosion.wav")
	if(!localStorage.getItem("scores")) localStorage.setItem("scores", JSON.stringify({ easy: 0, medium: 0, hard: 0 }))
	hintDiv = document.getElementById("hint")
	guessDiv = document.getElementById("guess")
	remainingDiv = document.getElementById("remaining")
	lettersDiv = document.getElementById("letters")
	screenDiv = document.getElementById("screen")
	screenStartDiv = document.getElementById("screenStart")
	highscoreDiv = document.getElementById("highscore")
	screenLeaderboard = document.getElementById("screenLeaderboard")
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
	populateLeaderboard()
}
