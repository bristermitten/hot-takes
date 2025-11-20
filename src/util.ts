declare global {
	interface Array<T> {
		randomElement(): T;
	}
}

Array.prototype.randomElement = function () {
	if (this.length === 1) {
		return this[0];
	}
	return this[Math.floor(Math.random() * this.length)];
};

/**
 * Ensures the array has a maximum length of 4, otherwise throws an error.
 * This might seem a bit silly but it satisfies the twitter api type definition and is a somewhat
 * helpful insurance to have.
 * @param arr  The array to check.
 * @returns  The array cast to a tuple of max length 4, or undefined if empty.
 */
export function expectArrayOfMaxLen4<T>(
	arr: T[],
): [T] | [T, T] | [T, T, T] | [T, T, T, T] | undefined {
	if (arr.length === 0) {
		return undefined;
	}
	if (arr.length > 4) {
		throw new Error(`Array length must be between 1 and 4, got ${arr.length}`);
	}
	return arr as [T] | [T, T] | [T, T, T] | [T, T, T, T];
}
