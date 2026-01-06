declare module 'gm' {
	interface Dimensions {
		width: number;
		height: number;
	}

	interface State {
		subClass(options: {imageMagick: boolean}): State;
		(image: Buffer | string): State;
		out(...args: string[]): State;
		resize(width: number, height: number, flag?: string): State;
		composite(other: string): State;
		gravity(direction: string): State;
		geometry(geometry: string): State;
		size(callback: (err: Error | null, size: Dimensions) => void): void;
		write(path: string, callback: (err: Error | null) => void): void;
		toBuffer(callback: (err: Error | null, buffer: Buffer) => void): void;
	}

	const gm: State;
	export = gm;
}
