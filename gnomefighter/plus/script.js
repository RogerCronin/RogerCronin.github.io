const fpsInterval = 1000 / 60
var fpsThen = 0
var gameDiv
var gameDivWidth = 1920
var gameDivHeight = 1080
var gameState = 0
// 0 - menu
// 1 - countdown
// 2 - in game
// 3 - postgame
var helpActive = false
var gnomeHealth = 200
var antiGnomeHealth = 200
var skinArray = [0, 1]
const skins = [
	"gnome",
	"antiGnome",
	"chrom",
	"fennec",
	"crab",
	"bear",
	"tetris",
	"crewmate",
	"ib",
	"dog",
	"cat",
	"thanos",
	"drip",
	"kakyoin",
	"jonesy",
	"goku",
	"saitama",
	"whatsapp",
	"netflix",
	"omni",
	"spencer"
]

const entities = {
	titleImage: {
		id: "titleImage",
		x: 587,
		y: 191,
		w: 748,
		h: 285
	},
	startButton: {
		id: "startButton",
		x: 737,
		y: 574,
		w: 441,
		h: 121
	},
	backButton: {
		id: "backButton",
		x: 760,
		y: 700,
		w: 425,
		h: 132
	},
	helpButton: {
		id: "helpButton",
		x: 755,
		y: 842,
		w: 418,
		h: 115
	},
	help: {
		id: "help",
		x: 0,
		y: 0,
		w: 1920,
		h: 1080
	},
	gnome: {
		id: "gnome",
		x: 77,
		y: 335,
		w: 500,
		h: 500
	},
	antiGnome: {
		id: "antiGnome",
		x: 1322,
		y: 279,
		w: 500,
		h: 500
	},
	number3: {
		id: "number3",
		x: 837,
		y: 416,
		w: 247,
		h: 248
	},
	number2: {
		id: "number2",
		x: 829,
		y: 417,
		w: 271,
		h: 247
	},
	number1: {
		id: "number1",
		x: 876,
		y: 418,
		w: 170,
		h: 245
	},
	start: {
		id: "start",
		x: 429,
		y: 417,
		w: 1064,
		h: 246
	}
}

const id = iden => document.getElementById(iden)
const sleep = ms => new Promise((a, b) => setTimeout(a, ms))

async function startGame() {
	if(gameState != 0) return
	gnomeHealth = 200
	antiGnomeHealth = 200
	gameState = 1
	id("titleImage").style.opacity = 0
	id("startButton").style.opacity = 0
	id("backButton").style.opacity = 0
	id("helpButton").style.opacity = 0
	helpActive = false
	id("help").style.opacity = 0
	await sleep(1000)
	id("number3").style.opacity = 1
	await sleep(1000)
	id("number3").style.opacity = 0
	id("number2").style.opacity = 1
	await sleep(1000)
	id("number2").style.opacity = 0
	id("number1").style.opacity = 1
	await sleep(1000)
	id("number1").style.opacity = 0
	id("start").style.opacity = 1
	gameState = 2
	await sleep(1500)
	id("start").style.transition = "opacity ease-out 1s"
	id("start").style.opacity = 0
	await sleep(1000)
	id("start").style.transition = ""
}

window.addEventListener("keyup", e => {
	if(gameState != 2) return
	if(e.code == "ShiftLeft" || e.code == "KeyQ") {
		gnomeAttack()
	} else if(e.code == "ShiftRight" || e.code == "KeyP") {
		antiGnomeAttack()
	}
})

document.addEventListener("click", e => {
	if(e.pageY < window.innerHeight / 4 || e.pageY > window.innerHeight / 4 * 3) return
	if(e.pageX < window.innerWidth / 3) skinChange(true)
	if(e.pageX > window.innerWidth / 3 * 2) skinChange(false)
})

function skinChange(num) {
	if(gameState == 0) {
		num = num ? 0 : 1
		skinArray[num]++
		if(skinArray[num] >= skins.length) skinArray[num] = 0
		id(num ? "antiGnome" : "gnome").src = `./assets/${skins[skinArray[num]]}.png`
	} else if(gameState == 2) {
		num ? gnomeAttack() : antiGnomeAttack()
	}
}

function gnomeError(element) {
	element.src = element.src.substring(0, element.src.length - 3) + "gif"
}

function gnomeAttack() {
	let damage = Math.floor(Math.random() * 5) + 1
	antiGnomeHealth -= damage
	spawnDamage(false, damage)
	if(antiGnomeHealth <= 0) {
		// gnome win
		win(true)
	}
}

function antiGnomeAttack() {
	let damage = Math.floor(Math.random() * 5) + 1
	gnomeHealth -= damage
	spawnDamage(true, damage)
	if(gnomeHealth <= 0) {
		// antignome win
		win(false)
	}
}

async function win(gnomeWin) {
	gameState = 3
	new Audio("./assets/explosion.wav").play()
	for(let i = 0; i < 40; i++) {
		spawnExplosion(gnomeWin)
		await sleep(10)
	}
	if(gnomeWin) id("antiGnome").style.transform = "rotate(90deg) scaleX(-1)"
	else id("gnome").style.transform = "rotate(-90deg)"
	await sleep(4000)
	id("gnome").style.transform = ""
	id("antiGnome").style.transform = "scaleX(-1)"
	gameState = 0
	id("titleImage").style.opacity = 1
	id("startButton").style.opacity = 1
	id("backButton").style.opacity = 1
	id("helpButton").style.opacity = 1
}

async function spawnExplosion(gnomeWin) {
	let rect = id(gnomeWin ? "antiGnome" : "gnome").getBoundingClientRect()
	let explosion = document.createElement("div")
	explosion.classList.add("explosion")
	explosion.style.left = `${rect.left + 80 + (Math.random() * 500 -200)}px`
	explosion.style.top = `${rect.top + 80 + (Math.random() * 500 - 200)}px`
	document.body.appendChild(explosion)
	for(let i = 0; i < 16; i++) {
		explosion.style.backgroundPosition = `0px -${i * 160}px`
		await sleep(25)
	}
	explosion.parentNode.removeChild(explosion)
}

async function spawnDamage(isGnome, amount) {
	let damage = document.createElement("p")
	damage.innerHTML = `-${amount}`
	let rect = id(isGnome ? "gnome" : "antiGnome").getBoundingClientRect()
	damage.style.left = `${rect.left + (Math.random() * 500 - 200)}px`
	damage.style.top = `${rect.top + (Math.random() * 500 - 200)}px`
	document.body.appendChild(damage)
	await sleep(100)
	damage.style.opacity = 0
	await sleep(900)
	damage.parentNode.removeChild(damage)
}

window.addEventListener("resize", onResize)

function onResize() {
	if(window.innerWidth / window.innerHeight >= 16 / 9) {
		let width = window.innerHeight * (16 / 9)
		let height = window.innerHeight
		gameDiv.style.width = `${width}px`
		gameDiv.style.height = `${height}px`
		gameDivWidth = width
		gameDivHeight = height
		updateEntitiesResize(width, height)
	} else {
		let width = window.innerWidth
		let height = window.innerWidth * (9 / 16)
		gameDiv.style.width = `${width}px`
		gameDiv.style.height = `${height}px`
		updateEntitiesResize(width, height)
		gameDivWidth = width
		gameDivHeight = height
	}
}

// TODO: refactor this
function updateEntitiesResize(w, h) {

	if(window.innerWidth / window.innerHeight >= 16 / 9) {
		// height based
		for(let entity in entities) {
			entity = entities[entity]
			// scaling
			entityScaling(entity, w, h)
			//positioning
			id(entity.id).style.left = `${entity.x / (1920 / w) + (window.innerWidth / 2) - (w / 2)}px`
			id(entity.id).style.top = `${entity.y / (1080 / h)}px`
		}
	} else {
		// width based
		for(let entity in entities) {
			entity = entities[entity]
			//scaling
			entityScaling(entity, w, h)
			//positioning
			id(entity.id).style.left = `${entity.x / (1920 / w)}px`
			id(entity.id).style.top = `${entity.y / (1080 / h) + (window.innerHeight / 2) - (h / 2)}px`
		}
	}

}

function help() {
	if(helpActive) {
		id("help").style.opacity = 0
		helpActive = false
	} else {
		id("help").style.opacity = 1
		helpActive = true
	}
}

function buttonMouse(button, mouseOver) {
	if(mouseOver) {
		id(button + "Button").src = `./assets/${button}ButtonHover.png`
	} else {
		id(button + "Button").src = `./assets/${button}Button.png`
	}
}

function entityScaling(entity, w, h) {
	id(entity.id).width = `${entity.w / (1920 / w)}`
	id(entity.id).height = `${entity.h / (1080 / h)}`
}

function loop(now) {
	let elapsed = now - fpsThen
	if(elapsed > fpsInterval) {
		update()
		onResize()
		fpsThen = now - (elapsed % fpsInterval)
	}
	window.requestAnimationFrame(loop.bind(this))
}

function update() {
	jitterEntity("gnome")
	jitterEntity("antiGnome")
}

// rewrite so it randomly picks between going towards other gnome and towards the center of the screen
function jitterEntity(iden) {
	if(gameState == 3) return
	let x = entities[iden].x + (Math.random() * 31 - 15.5)
	let y = entities[iden].y + (Math.random() * 31 - 15.5)
	if(x < 0) x = 0
	if(x > 1921 - entities[iden].w) x = 1921 - entities[iden].w
	if(y < 0) y = 0
	if(y > 1081 - entities[iden].h) y = 1081 - entities[iden].h
	entities[iden].x = x
	entities[iden].y = y
}

function onLoad() {
	gameDiv = id("gameDiv")
	onResize()
	loop()
	id("titleImage").style.opacity = 1
	id("startButton").style.opacity = 1
	id("backButton").style.opacity = 1
	id("helpButton").style.opacity = 1
}
