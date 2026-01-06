declare module 'appdmg' {
	import {EventEmitter} from 'events';

	interface AppdmgSpecification {
		title: string;
		icon?: string;
		background?: string;
		'icon-size'?: number;
		format?: string;
		filesystem?: string;
		window?: {
			size?: {
				width: number;
				height: number;
			};
			position?: {
				x: number;
				y: number;
			};
		};
		contents: Array<{
			x: number;
			y: number;
			type: 'file' | 'link' | 'position';
			path: string;
			name?: string;
		}>;
	}

	interface AppdmgOptions {
		target: string;
		basepath: string;
		specification: AppdmgSpecification;
	}

	interface AppdmgProgress {
		type: string;
		title?: string;
		status?: string;
		current?: number;
		total?: number;
	}

	interface AppdmgEmitter extends EventEmitter {
		on(event: 'progress', listener: (info: AppdmgProgress) => void): this;
		on(event: 'finish', listener: () => void): this;
		on(event: 'error', listener: (error: Error) => void): this;
	}

	function appdmg(options: AppdmgOptions): AppdmgEmitter;

	export = appdmg;
}
