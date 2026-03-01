"use client";

import { useCallback, useEffect, useState } from "react";
import { createModelScaler, type ScaleConstraints } from "@/lib/utils";

/**
 * Responsive version of createModelScaler.
 *
 * The maxWidth / maxHeight constraints are additionally capped to the current
 * viewport size so the element never overflows on small screens — exactly like
 * CSS max-width behaviour. Re-evaluates on every window resize.
 */
export function useModelScaler(
	model: { width: number; height: number },
	constraints: ScaleConstraints,
) {
	// Destructure so the callback deps are stable primitives, not object refs.
	const { maxWidth, minWidth, maxHeight, minHeight } = constraints;

	const compute = useCallback(() => {
		const vw =
			typeof window !== "undefined" ? window.innerWidth : Infinity;
		const vh =
			typeof window !== "undefined" ? window.innerHeight : Infinity;

		return createModelScaler(model, {
			maxWidth:
				maxWidth !== undefined ? Math.min(maxWidth, vw) : undefined,
			minWidth,
			maxHeight:
				maxHeight !== undefined ? Math.min(maxHeight, vh) : undefined,
			minHeight,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [model.width, model.height, maxWidth, minWidth, maxHeight, minHeight]);

	// Lazy-initialise so the very first render already has the right value.
	const [scaler, setScaler] = useState(compute);

	useEffect(() => {
		const onResize = () => setScaler(compute());
		onResize(); // recalculate after hydration
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [compute]);

	return scaler;
}
