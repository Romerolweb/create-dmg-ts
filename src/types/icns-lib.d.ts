declare module 'icns-lib' {
	export function parse(buffer: Buffer): Record<string, Buffer>;
	export function format(images: Record<string, Buffer>): Buffer;
	export function isImageType(type: string): boolean;
}
