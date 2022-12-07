const id = iden => document.getElementById(iden)
let clientIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

let usesGameboy = calcUsesGameboy()
let currentlyAnimating = false

const gameInfoObject = {
	"gnome": [
		"Gnome Fighter+",
		"A riveting button-mashing fighting game staring Gnome and Anti-Gnome, completely remade with bonus content!",
		"gnomefighter/plus",
		true
	],
	"tetris": [
		"Twitch Tetris v2.1",
		"Twitch Tetris, ported to SquareBrackets with a few quality-of-life improvements. Not affiliated with Twitch.",
		"twitchtetris",
		false
	],
	"roulette": [
		"Russian Roulette",
		"The classic party game you know and love, but the \"bullet\" is hearing loss. Earbuds required!",
		"russianroulette",
		true
	],
	"crab sim": [
		"Crab Simulator v1.4 (web)",
		"Crab Simulator, ported to the internet for easy access.",
		"crabsimulator/CrabSimulator1.4",
		false
	],
	"crab py": [
		"Crab Simulator v1.3 (download)",
		"A download link for Crab Simulator, originally developed on Python 3, then ported to Windows devices.",
		"crabsimulator/CrabSimulator1.3.zip",
		false,
		"download"
	],
	"hangman": [
		"Hangman",
		"A swanky hangman player without the scary implications of what \"hangman\" actually represents.",
		"hangman",
		true
	]
}

function updateGameInfo(label) {
	info = gameInfoObject[label]
	id("gameInfoTitle").innerHTML = info[0]
	id("gameInfoParagraph").innerHTML = info[1]
	id("launchButton").onclick = () => startGame(`/${info[2]}`)
	if(clientIsMobile && !info[3]) id("gameInfoParagraph").innerHTML += "<br><span class='darkred'>* Mobile incompatible</span>"

	id("gameInfoTitleDefault").innerHTML = info[0]
	id("gameInfoParagraphDefault").innerHTML = info[1]
	id("launchButtonDefault").onclick = () => location.href = `${info[2]}`
	if(clientIsMobile && !info[3]) id("gameInfoParagraphDefault").innerHTML += "<br><span class='darkred'>* Mobile incompatible</span>"
	id("launchButtonDefault").innerHTML = info[4] || "launch"
}

let activeGame = null

function clickGame(game) {

	if(!usesGameboy) return clickGameDefault(game)

	if(currentlyAnimating) return
	currentlyAnimating = true

	activeGame = game
	bounds = game.getBoundingClientRect()

	game.style.left = `${bounds.left}px`
	game.style.top = `${bounds.top}px`
	game.style.transition = "box-shadow ease 0.25s"
	game.classList.add("active")
	id("gameboy").style.bottom = "10px"
	game.style.zIndex = 1
	setTimeout(() => {
		game.style.transition = null
		game.style.left = null
		game.style.top = `${window.innerHeight - 850}px`
		currentlyAnimating = false
	}, 0)
	
	updateGameInfo(game.children[0].innerHTML)

	id("blanketDiv").classList.add("active")
	id("blanketDiv").style.zIndex = 1
}

function clickGameDefault(game) {
	updateGameInfo(game.children[0].innerHTML)
	id("blanketDiv").classList.add("active")
	id("blanketDiv").style.zIndex = 1
}

function goBack() {

	if(currentlyAnimating) return
	currentlyAnimating = true

	if(!usesGameboy) return goBackDefault()

	id("gameboy").style.bottom = null
	id("blanketDiv").classList.remove("active")

	bounds = activeGame.parentElement.getBoundingClientRect()
	activeGame.style.left = `${bounds.left}px`
	activeGame.style.top = `${bounds.top}px`

	activeGame.addEventListener("transitionend", () => {
		activeGame.style.left = null
		activeGame.style.top = null
		activeGame.style.zIndex = null
		activeGame.style.position = null
		activeGame.style.transition = "box-shadow ease 0.25s"
		activeGame.classList.remove("active")
		setTimeout(() => {
			activeGame.style.transition = null
			activeGame = null
			currentlyAnimating = false
		}, 1)
	}, { once: true })

	setTimeout(() => id("blanketDiv").style.zIndex = -1, 500) // move to back after css transition
}

function goBackDefault() {
	id("blanketDiv").classList.remove("active")
	setTimeout(() => id("blanketDiv").style.zIndex = -1, 500) // move to back after css transition
}

function startGame(link) {
	currentlyAnimating = true
	activeGame.style.top = `${window.innerHeight - 590}px`
	setTimeout(() => {
		currentlyAnimating = false
		location.href = link
	}, 500)
}

function calcUsesGameboy() {
	return window.innerHeight > 900 && window.innerWidth > 900
}

window.addEventListener("resize", () => {
	usesGameboy = calcUsesGameboy()
})