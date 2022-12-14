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
		"The classic party game you know and love, but the \"bullet\" is hearing loss. Take turns passing the earbuds and firing!",
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
		"A swanky hangman player without the scary implications of what the \"hangman\" actually represents.",
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

function funFact() {
	const textElement = id("funFactsText")

	if(!textElement.classList.contains("active")) return

	textElement.classList.remove("active")
	textElement.addEventListener("transitionend", () => {
		let randomFact = getRandomFunFact()
		while(randomFact == textElement.innerHTML) {
			randomFact = getRandomFunFact()
		}
		textElement.innerHTML = randomFact
		textElement.classList.add("active")
	}, { once: true })
}

let funFactsList = [
	"Roger was raised by wolves until the age of 6",
	"King Gizzard and the Lizard Wizard is Roger's favorite band",
	"Roger can speak over 300 languages including English, Polish, and JavaScript",
	"Roger is a lot cooler than you are",
	"R is the first letter in Roger's name",
	"Roger's last name is Cronin",
	"Roger thinks you should listen to <a href='https://open.spotify.com/track/0o6rOggbaLEvtwUHNztuD2?si=1db9cb80e7f64cdb' target='_blank'>The Dripping Tap</a> on Spotify",
	"R is the last letter in Roger's name",
	"Washington, D.C. is the capital of the United States of America",
	"The borzoi is Roger's favorite breed of dog",
	"Crabs are nice animals, but not as nice as you are :)",
	"Roger goes to the gym but he really doesn't want to",
	"What if we spelled jeans like genes wouldn't that be fucked up?",
	"Roger isn't real, he's actually a figment of your imagination",
	"Roger was involved in a hit and run in 1989 and the police haven't caught him yet",
	"Roger loves to put himself in high risk low reward situations",
	"Roger's self-destructive habits haven't caught up to him yet",
	"With your help, Roger can be stopped",
	"Roger's Venmo is @roger_cronin",
	"Chocolate ice cream is better than vanilla, it's no contest like who would genuinely say vanilla over chocolate?",
	"Roger has three brothers, all also named Roger",
	"The best time to plant a tree was 20 years ago",
	"Ow! Stop clicking me!",
	"Roger hopes to one day own a Honda Civic",
	"Roger's first job was working the coal mines like his father and his father before him"
]

fetch("https://ipapi.co/json/")
	.then(res => res.json())
	.then(json => {
		if(!json || !json.ip || !json.city || !json.region) return
		funFactsList.push(`Your IP address is ${json.ip} and you live in ${json.city}, ${json.region}`)
	})

fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=brackets_square&api_key=73e9eebfe28feba67f29a13f1ecc85db&format=json")
	.then(res => res.json())
	.then(async json => {
		if(!json || !json.recenttracks || !json.recenttracks.track) return
		id("recentTrackWrapper").innerHTML = ""
		const tracks = json.recenttracks.track
		for(let i = 0; i < 3; i++) {
			let track = tracks[i]
			const div = document.createElement("div")
			const img = document.createElement("img")
			img.src = track.image[1]["#text"]
			const p = document.createElement("p")
			p.innerHTML = `<a href='${track.url}' target='_blank'>${track.name} - ${track.artist["#text"]}</a>`
			if(!track.date) p.innerHTML += "<br><span class='nowListening'>Now listening</span>"
			div.appendChild(img)
			div.appendChild(p)
			id("recentTrackWrapper").appendChild(div)
		}
	})

function getRandomFunFact() {
	return funFactsList[Math.floor(Math.random() * funFactsList.length)]
}