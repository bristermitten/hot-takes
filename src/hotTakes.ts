import { randomInt } from "node:crypto";
import { readFileSync } from "node:fs";

import { basename } from "node:path";
import JSON5 from "json5";
import { z } from "zod";
import { expectArrayOfMaxLen4 } from "./util.js";

const takeItemValueSchema = z.string().meta({
	id: "TakeItemValue",
	title: "Value",
	description:
		"The text value of the take item, which will be used when replacing placeholders.",
});

const imageFilenameSchema = z.string().meta({
	id: "ImageFilename",
	title: "Image Filename",
	description: "The filename of the image associated with this item.",
});

/**
 * Schema for a take item object which has both a value and an image.
 */
const TakeItemObjectSchema = z
	.object({
		value: takeItemValueSchema,
		image: imageFilenameSchema,
	})
	.meta({
		title: "Take Item Object",
		description: "An object that contains a text value and an image filename.",
	});

/**
 * Schema for a take item which can be either a string value or a take item object.
 */
const TakeItemSchema = z
	.union([takeItemValueSchema, TakeItemObjectSchema])
	.meta({
		id: "TakeItem",
		title: "Take Item",
		description:
			"A take item which can be either a text value or an object with a value and an image.",
	});

const takeValueSchema = z.string().meta({
	id: "Take",
	title: "Take",
	description: "The take template string, which may contain placeholders.",
});

/**
 * Schema for a take definition object which has a take and an optional image or images.
 */
const TakeDefinitionObjectSchema = z
	.object({
		take: takeValueSchema,
		image: z
			.union([imageFilenameSchema, z.array(imageFilenameSchema).max(4)])
			.optional()
			.meta({
				title: "Image or Images",
				description:
					"An optional image filename or an array of image filenames associated with this take.",
			}),
	})
	.meta({
		title: "Take Definition Object",
		description:
			"An object that contains a take template string and an optional image or images.",
	});

/**
 * Schema for a take definition which can be either a string or a take definition object.
 */
const TakeDefinitionSchema = z
	.union([takeValueSchema, TakeDefinitionObjectSchema])
	.meta({
		title: "Take Definition",
		description:
			"A take definition which can be either a text template string or an object with a take and optional images.",
	});

/**
 * Schema for the entire hot take data structure.
 */
export const HotTakeDataSchema = z
	.object({
		people: z.array(TakeItemSchema).meta({
			title: "People",
			description: "A list of influential people in the tech industry.",
		}),
		companies: z.array(TakeItemSchema).meta({
			title: "Companies",
			description: "A list of tech companies.",
		}),
		languages: z.array(TakeItemSchema).meta({
			title: "Programming Languages",
			description: "A list of programming languages.",
		}),
		technologies: z.array(TakeItemSchema).meta({
			title: "Technologies",
			description: "A list of technologies, frameworks, and technical concepts",
		}),
		problems: z.array(z.string()).meta({
			title: "Problems",
			description: "A list of common problems in software development.",
		}),
		tlds: z.array(z.string()).meta({
			title: "Top-Level Domains",
			description: "A list of top-level domains.",
		}),
		takes: z.array(TakeDefinitionSchema).meta({
			title: "Takes",
			description: "A list of hot take templates.",
		}),
	})
	.meta({
		title: "Hot Take Data",
		description:
			"The complete data structure containing all possible take items and templates for generating hot takes.",
	});

type HotTakeData = z.infer<typeof HotTakeDataSchema>;

/**
 * A TakeItem can be either a simple string or an object with a value and an image.
 */
type TakeItem = z.infer<typeof TakeItemSchema>;

/**
 * A TakeDefinition can be either a simple string or an object with a take and an optional image.
 */
type TakeDefinition = z.infer<typeof TakeDefinitionSchema>;

/**
 * Apply a function to replace the value in a {@link TakeItem}.
 * @param f the function to apply to the take
 * @param thing the HotTakeThing to modify
 * @returns the modified HotTakeThing
 */
function replaceTakeItemValue(
	f: (arg: string) => string,
	thing: TakeItem,
): TakeItem {
	if (typeof thing === "string") return f(thing);
	return {
		value: f(thing.value),
		image: thing.image,
	};
}

/**
 * Get the take value from a {@link TakeItem}.
 * @param thing the {@link TakeItem} to extract the take from
 * @returns the take value as a string
 */
function takeItemValue(thing: TakeItem): string {
	if (typeof thing === "string") return thing;
	return thing.value;
}

/**
 * Get the take value from a {@link TakeDefinition}.
 * @param thing the {@link TakeDefinition} to extract the take from
 * @returns the take value as a string
 */
function takeDefinitionValue(thing: TakeDefinition): string {
	if (typeof thing === "string") return thing;
	return thing.take;
}

/**
 * Get the images from a {@link TakeItem}.
 * @param thing the {@link TakeItem} to extract images from
 * @returns an array of image filenames
 */
function takeItemImages(thing: TakeItem): string[] {
	if (typeof thing === "string") return [];
	const images = [thing.image].flat();
	return images.map((p) => basename(p));
}

/**
 * Get the images from a {@link TakeDefinition}.
 * @param thing the {@link TakeDefinition} to extract images from
 * @returns an array of image filenames
 */
function takeDefinitionImages(thing: TakeDefinition): string[] {
	if (typeof thing === "string") return [];
	if (!thing.image) return [];
	const images = [thing.image].flat();
	return images.map((p) => basename(p));
}

/**
 * The hot take data loaded from hotTakeData.json.
 */
let hotTakeData: HotTakeData = HotTakeDataSchema.parse(
	JSON5.parse(readFileSync(`${process.cwd()}/hotTakeData.json5`).toString()),
);

/**
 * @internal Used for testing purposes only.
 * Injects mock data to bypass file reading in tests.
 * @param data The mock {@link HotTakeData} to use.
 */
export function __setHotTakeData(data: HotTakeData) {
	hotTakeData = data;
}

type PlaceholderFunction = (users: string[]) => TakeItem[];

type PlaceholdersType = {
	readonly [key: string]: PlaceholderFunction;
};
/**
 * Placeholders mapping to functions that return arrays of TakeItems.
 */
const placeholders = {
	language: () => hotTakeData.languages,
	technology: () => hotTakeData.technologies,
	tld: () => hotTakeData.tlds,
	thing: combinePlaceholderSources("languages", "technologies"),
	anything: combinePlaceholderSources(
		"languages",
		"technologies",
		"people",
		"companies",
	),
	oneWordAnything: (users: string[]): TakeItem[] =>
		mapPlaceholder("anything", (it) =>
			replaceTakeItemValue((s) => s.replace(" ", ""), it),
		)(users),
	person: () => hotTakeData.people,
	company: () => hotTakeData.companies,
	group: combinePlaceholderSources("people", "companies"),
	problem: () => hotTakeData.problems,
	year: () => [randomInt(1500, 2022).toString()] as TakeItem[],
	age: () => [randomInt(1, 50).toString()] as TakeItem[],
	bigNumber: () => [randomInt(2, 100000).toString()] as TakeItem[],
	percentage: () => [randomInt(1, 100).toString()] as TakeItem[],
	oneWordThing: (users: string[]): TakeItem[] =>
		mapPlaceholder("thing", (it) =>
			replaceTakeItemValue((s) => s.replace(" ", ""), it),
		)(users),
} satisfies PlaceholdersType;

/**
 * Type of a placeholder, i.e., a key of the placeholders object.
 */
type Placeholder = keyof typeof placeholders;

/**
 * Type guard to check if a string is a valid placeholder.
 * @param value  the string to check
 * @returns  true if the string is a valid placeholder, false otherwise
 */
function isValidPlaceholder(value: string): value is Placeholder {
	return Object.keys(placeholders).includes(value);
}

/**
 * Combines multiple {@link Placeholder}s into a single {@link PlaceholderFunction}.
 * @param source the placeholders to combine, cannot be "takes"
 * @returns  a function that returns the combined TakeItems
 */
function combinePlaceholderSources(
	...source: Exclude<keyof HotTakeData, "takes">[]
): PlaceholderFunction {
	if (source.length === 0) return () => [];
	const head: TakeItem[] = hotTakeData[source[0]];
	const tail = source.slice(1).flatMap((it) => hotTakeData[it]);
	return (users: string[]) => head.concat(tail, users);
}

/**
 * Wraps a {@link PlaceholderFunction} to map over its results with a given function.
 * @param key the placeholder to map over
 * @param f the function to apply to each TakeItem
 * @returns a new {@link PlaceholderFunction} with the mapped results
 */
function mapPlaceholder(
	key: Placeholder,
	f: (s: TakeItem) => TakeItem,
): PlaceholderFunction {
	return (users: string[]) => placeholders[key](users).map(f);
}

/**
 * The response type of the generateHotTake function.
 * Contains a take string and an optional array of up to 4 image filenames.
 */
type HotTakeResponse = {
	take: string;
	images?:
		| [string]
		| [string, string]
		| [string, string, string]
		| [string, string, string, string];
};

/**
 * Pattern to match placeholders in the take string.
 * Matches strings like "{language}" or "{thing|person}".
 */
const placeholderPattern = /{([\w|]+)}/g;

/**
 * Generates a hot take by selecting a random take and replacing placeholders with random values.
 * @param users  an optional array of user-provided strings to include in the take generation
 * @returns  a Promise that resolves to a HotTakeResponse containing the generated take and associated images
 */
export async function generateHotTake(
	users: string[] = [],
): Promise<HotTakeResponse> {
	const images: string[] = [];
	const randomTake = hotTakeData.takes.randomElement();
	const takeImages = takeDefinitionImages(randomTake);
	const takeValue = takeDefinitionValue(randomTake);
	const take = takeValue.replace(placeholderPattern, (value) => {
		const randomReplacement = value
			.slice(1, -1) // remove the {}
			.split("|") // split into options
			.filter(isValidPlaceholder) // filter out invalid placeholders
			.flatMap((it) => {
				return placeholders[it](users);
			}) // get the values for each placeholder
			.randomElement(); // pick a random value
		const replacementImage = takeItemImages(randomReplacement);
		if (replacementImage) images.push(...replacementImage);
		return takeItemValue(randomReplacement);
	});
	if (takeImages) images.push(...takeImages); // add the take image to the end
	return {
		take,
		images: expectArrayOfMaxLen4(images),
	};
}
