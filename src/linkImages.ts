import {promises, readFileSync} from "fs";
import stringSimilarity from 'string-similarity';

type HotTakeThing = string | {
	take: string,
	image: string
}

const hotTakeData: {
	people: HotTakeThing[],
	companies: HotTakeThing[],
	languages: HotTakeThing[]
	technologies: HotTakeThing[],
	problems: HotTakeThing[],
	tlds: HotTakeThing[]
	takes: HotTakeThing[],
} = JSON.parse(readFileSync(process.cwd() + '/hotTakeData.json').toString())

function addImageToHotTakeThing(thing: HotTakeThing, image: string): HotTakeThing {
	if (typeof thing === 'string') return {take: thing, image}
	return thing
}

async function findClosestImage(thing: string) {
	const files = await promises.readdir(process.cwd() + '/img')

	const trimmed = files.map(name =>
		name.split('.').slice(0, -1).join('.')
	)
	const similar = stringSimilarity.findBestMatch(thing, trimmed)
	const max = files[similar.bestMatchIndex]
	return './img/' + max
}


const newData = {
	problems: hotTakeData.problems,
}
console.log(JSON.stringify(newData, null, 2))