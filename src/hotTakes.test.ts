import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { z } from "zod";
import {
	__setHotTakeData,
	generateHotTake,
	type HotTakeDataSchema,
} from "./hotTakes.js";

// Create a valid, empty mock data object to reset state
const emptyMockData: z.infer<typeof HotTakeDataSchema> = {
	people: [],
	companies: [],
	languages: [],
	technologies: [],
	problems: [],
	tlds: [],
	takes: [],
};

describe("generateHotTake", () => {
	// No more randomElementSpy since we want randomness

	beforeEach(() => {
		// Before each test, inject our mock data.
		// This data is static, but generateHotTake will randomly pick from it.
		__setHotTakeData({
			...emptyMockData,
			languages: [{ value: "C++", image: "c++.png" }],
			technologies: [{ value: "Blockchain", image: "blockchain.png" }],
			problems: ["Writing tests"],
			takes: [
				"Take with a language {language}", // Will produce "c++.png"
				"Take with a technology {technology}", // Will produce "blockchain.png"
				"This is a take about {problem}", // Will produce no image
			],
		});
	});

	afterEach(() => {
		// Reset to empty mock data to ensure tests are isolated
		__setHotTakeData(emptyMockData);
	});

	it("should generate a hot take", async () => {
		const hotTake = await generateHotTake();
		expect(hotTake).toBeDefined();
		expect(typeof hotTake.take).toBe("string");
	});

	it("should replace placeholders with values", async () => {
		// This test will now pass randomly for any take,
		// as long as placeholders are replaced.
		const hotTake = await generateHotTake();
		expect(hotTake.take).not.toMatch(/{|}/);
	});

	it("should correctly handle images for random takes", async () => {
		const hotTake = await generateHotTake();

		if (hotTake.take.includes("C++")) {
			expect(hotTake.images).toBeDefined();
			expect(hotTake.images).toContain("c++.png");
		} else if (hotTake.take.includes("Blockchain")) {
			expect(hotTake.images).toBeDefined();
			expect(hotTake.images).toContain("blockchain.png");
		} else if (hotTake.take.includes("Writing tests")) {
			// This take uses a {problem} placeholder which has no associated image
			expect(hotTake.images).toBeUndefined();
		} else {
			// This else branch should theoretically not be hit with our mock data.
			// If it is, it means a take was generated that we didn't account for,
			// or the logic has changed unexpectedly.
			// We can assert false to indicate an unexpected state.
			expect(true).toBe(false);
		}
	});

	it("should return a maximum of 4 images", async () => {
		const hotTake = await generateHotTake();
		if (hotTake.images) {
			expect(hotTake.images.length).toBeLessThanOrEqual(4);
		}
	});
});
