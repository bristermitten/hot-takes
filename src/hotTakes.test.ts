import { describe, expect, it, mock } from "bun:test";
import generateHotTake from "./hotTakes";

// Mock readFileSync
mock.module("node:fs", () => ({
	readFileSync: (path: string) => {
		if (path.endsWith("hotTakeData.json5")) {
			return JSON.stringify({
				people: [],
				companies: [],
				languages: [{ take: "C++", image: "c++.png" }],
				technologies: [{ take: "Blockchain", image: "blockchain.png" }],
				problems: [],
				tlds: [],
				takes: [
					"Take with a language {language}",
					"Take with a technology {technology}",
					"Take with an image {language}",
				],
			});
		}
		return "";
	},
}));

describe("generateHotTake", () => {
	it("should generate a hot take", async () => {
		const hotTake = await generateHotTake();
		expect(hotTake).toBeDefined();
		expect(typeof hotTake.take).toBe("string");
	});

	it("should replace placeholders with values", async () => {
		const hotTake = await generateHotTake();
		expect(hotTake.take).not.toMatch(/{|}/);
	});

	it("should include images from the take", async () => {
		const hotTake = await generateHotTake();
		if (hotTake.take.includes("C++")) {
			expect(hotTake.images).toContain("c++.png");
		}
		if (hotTake.take.includes("Blockchain")) {
			expect(hotTake.images).toContain("blockchain.png");
		} 
	});

	it("should return a maximum of 4 images", async () => {
		const hotTake = await generateHotTake();
		if (hotTake.images) {
			expect(hotTake.images.length).toBeLessThanOrEqual(4);
		}
	});
});
