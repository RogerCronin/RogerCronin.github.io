const apiURL = "https://SquareBracketsAPI.rogercronin1.repl.co/hangman/"

let useLeaderboard = true
let leaderboardHigh = 0
let leaderboardName = ""

async function displayLeaderboard() {
	screenStartDiv.addEventListener("transitionend", async () => {
		screenStartDiv.style.display = "none"
		screenLeaderboard.style.display = "flex"
		screenLeaderboard.style.opacity = 0
		await new Promise(r => setTimeout(r, 0)) // what the fuck?
		screenLeaderboard.style.opacity = 1
	}, { once: true })
	screenStartDiv.style.opacity = 0
}

async function removeLeaderboard() {
	screenLeaderboard.addEventListener("transitionend", async () => {
		screenLeaderboard.style.display = "none"
		screenStartDiv.style.display = "flex"
		screenStartDiv.style.opacity = 0
		await new Promise(r => setTimeout(r, 0))
		screenStartDiv.style.opacity = 1
	}, { once: true })
	screenLeaderboard.style.opacity = 0
}

async function populateLeaderboard() {
	try {
		let res = await fetch(apiURL + "getScores/")
		let data = await res.json()
		data = data.scores
		leaderboardHigh = data[4][1]
		updateLeaderboard(data)
	} catch(e) {
		console.log("Error in fetching leaderboard!")
		console.error(e)
		useLeaderboard = false
		document.getElementById("leaderboardButton").style.display = "none"
	}
}

function updateLeaderboard(data) {
	let table = screenLeaderboard.children[0].children[0]
	
	// I still don't know why this is necessary
	// whenever I delete it normally, weird stuff happens
	let toDelete = []
	for(let i of table.children) {
		if(i.cells[0].colSpan != 2) {
			toDelete.push(i)
		}
	}
	for(let i of toDelete) {
		i.remove()
	}

	for(let i of data) {
		let row = document.createElement("tr")
		let name = document.createElement("td")
		name.innerHTML = i[0]
		let number = document.createElement("td")
		number.innerHTML = i[1]
		row.appendChild(name)
		row.appendChild(number)
		table.appendChild(row)
	}
}

function handleLeaderboard() {
	leaderboardName = ""
	state = 3
	resetLetters()
	hint = "Welcome to the leaderboard!"
	guessWord = "3 letter name"
	updateTexts()
}

async function leaderboardInput(e) {
	e = e.target || e
	e.addEventListener("transitionend", () => {
		e.style.transitionTimingFunction = "ease-in"
		e.style.transform = "scale(1, 1)"
	}, { once: true })
	e.classList.add("pressed")
	leaderboardName += e.innerHTML.toUpperCase()
	guessWord = leaderboardName
	updateTexts()
	if(leaderboardName.length >= 3) {
		if(nameCheck(leaderboardName)) {
			state = 4
			hint = "Sending score..."
			updateTexts()
			try {
				let res = await fetch(apiURL + "submitScore/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						name: leaderboardName,
						score: score
					})
				})
				let data = await res.json()
				if(data.status == "fail") throw new Error("Failed name checks")
				data = data.scores
				leaderboardHigh = data[4][1]
				updateLeaderboard(data)
				hint = "Leaderboard updated!"
				updateTexts()
				await sleep(5000)
				resetLetters()
				hint = "hangman"
				guessWord = "_____"
				updateTexts()
				screenDiv.addEventListener("transitionend", () => {
					state = 0
					displayLeaderboard()
				}, { once: true })
				screenDiv.style.backgroundColor = "rgba(232, 232, 232, 0.6)"
				screenStartDiv.style.opacity = 1
				screenDiv.style.zIndex = 2
			} catch(e) {
				console.log("Error in sending score!")
				console.error(e)
				hint = "Failed send"
				guessWord = "Sorry!"
				updateTexts()
				await sleep(5000)
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
		} else {
			guessWord = "bad name"
			leaderboardName = ""
			updateTexts()
		}
	}
}

const bannedNames = [
	"PNS",
	"FAG",
	"FGT",
	"NGR",
	"NIG",
	"CNT",
	"KNT",
	"SHT",
	"CLT",
	"KLT",
	"GAY",
	"GEY",
	"GEI",
	"GAI",
	"VAG",
	"VGN",
	"SJV",
	"FAP",
	"JEW",
	"JOO",
	"PUS",
	"TIT",
	"HOR",
	"SLT",
	"JAP",
	"KIK",
	"KYK",
	"KYC",
	"KYQ",
	"DYK",
	"DYQ",
	"DYC",
	"KKK",
	"JYZ",
	"VAJ",
	"VJN",
	"ORL",
	"ANL",
	"ASS",
	"CUM",
	"SEX"
]

function nameCheck(name) {
	if(name.match("^[A-Z]{3}$")) {
		return !bannedNames.includes(name)
	}
	return false
}