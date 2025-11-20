// Used to add randomElement, eslint is dumb
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export {}
declare global {
	interface Array<T> {
		randomElement(): T
	}
}


Array.prototype.randomElement = function () {
	if (this.length == 1) {
		return this[0]
	}
	return this[Math.floor(Math.random() * this.length)]
}


export function expectArrayOfMaxLen4<T>(arr: T[]): [T] | [T, T] | [T, T, T] | [T, T, T, T] {
	if (arr.length < 1 || arr.length > 4) {
		throw new Error(`Array length must be between 1 and 4, got ${arr.length}`)
	}
	return arr as [T] | [T, T] | [T, T, T] | [T, T, T, T]
}
