function randomPos(isTop) {
	if(isTop) return window.innerHeight / 2 + (Math.random() * window.innerHeight - window.innerHeight / 2)
	else return window.innerWidth / 2 + (Math.random() * window.innerWidth - window.innerWidth / 2)
}

async function spawnPerfect() {
	pixelWidth = window.innerWidth / 29
	if(pixelWidth > 30) {
		await spawnLetter(letterSprites.p, pixelWidth, 1)
		await sleep(100)
		await spawnLetter(letterSprites.e, pixelWidth, 5)
		await sleep(100)
		await spawnLetter(letterSprites.r, pixelWidth, 9)
		await sleep(100)
		await spawnLetter(letterSprites.f, pixelWidth, 13)
		await sleep(100)
		await spawnLetter(letterSprites.e, pixelWidth, 17)
		await sleep(100)
		await spawnLetter(letterSprites.c, pixelWidth, 21)
		await sleep(100)
		await spawnLetter(letterSprites.t, pixelWidth, 25)
		await sleep(5000)
	} else {
		for(let i = 0; i < 200; i++) {
			spawnPixel(false, randomPos(false), randomPos(true))
			await sleep(10)
		}
		await sleep(3000)
	}
}

async function spawnLetter(matrix, pixelWidth, offset) {
	for(let x = 0; x < matrix[0].length; x++) {
		for(let y = 0; y < matrix.length; y++) {
			if(matrix[y][x]) spawnPixel(false,
					pixelWidth * x + pixelWidth * offset,
					pixelWidth * y + window.innerHeight / 2 - pixelWidth * 3,
					[Math.random() * 500, 1500])
		}
	}
}

async function spawnPixel(isExplosion, left, top, sleepTime = [0, 0]) {
	await sleep(sleepTime[0])
	let pixel = document.createElement("div")
	pixel.classList.add(isExplosion ? "explosion" : "fireworks")
	pixel.style.left = `${left}px`
	pixel.style.top = `${top}px`
	if(!isExplosion) pixel.style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`
	document.body.appendChild(pixel)
	if(isExplosion) {
		for(let i = 0; i < 16; i++) {
			pixel.style.backgroundPosition = `0px -${i * 160}px`
			await sleep(25)
		}
	} else {
		for(let i = 0; i < 16; i++) {
			pixel.style.backgroundPosition = `0px -${i * 40}px`
			await sleep(75)
		}
		await sleep(Math.random() * 800)
	}
	await sleep(sleepTime[1])
	pixel.parentNode.removeChild(pixel)
}