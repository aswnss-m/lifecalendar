import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createScaler(ogWidth: number, newWidth: number) {
	const scale = newWidth / ogWidth;

	return function (value: number) {
		return value * scale;
	};
}

export interface ScaleConstraints {
	maxWidth?: number;
	minWidth?: number;
	maxHeight?: number;
	minHeight?: number;
}

/**
 * Given a model with original dimensions and CSS-like constraints,
 * returns x_scale / y_scale functions (both using the same uniform scale
 * so aspect ratio is preserved), plus the computed width and height.
 *
 * Priority: maxWidth / maxHeight shrink first, then minWidth / minHeight
 * push back up (min wins over max if they conflict).
 */
export function createModelScaler(
	model: { width: number; height: number },
	constraints: ScaleConstraints,
) {
	let scale = Infinity;

	if (constraints.maxWidth !== undefined)
		scale = Math.min(scale, constraints.maxWidth / model.width);
	if (constraints.maxHeight !== undefined)
		scale = Math.min(scale, constraints.maxHeight / model.height);

	if (!isFinite(scale)) scale = 1;

	if (constraints.minWidth !== undefined)
		scale = Math.max(scale, constraints.minWidth / model.width);
	if (constraints.minHeight !== undefined)
		scale = Math.max(scale, constraints.minHeight / model.height);

	return {
		x_scale: (value: number) => value * scale,
		y_scale: (value: number) => value * scale,
		width: model.width * scale,
		height: model.height * scale,
		scale,
	};
}

