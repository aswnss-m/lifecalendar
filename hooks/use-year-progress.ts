"use client";

import { useEffect, useState } from "react";
import { monthsData, yearProgress, type YearProgress } from "@/lib/days-in-year";

const PLACEHOLDER: YearProgress = {
	passed: -1,
	total: 365,
	daysLeft: 365,
	percentage: 0,
	months: monthsData(2025),
	secondsUntilMidnight: 0,
};

/**
 * Day counts in the browser's time zone. Computed after mount because the pages are
 * prerendered, so a server value would use the build date and the server's zone.
 * `ready` is false on the first render, when the placeholder (no days passed) is returned.
 */
export function useYearProgress() {
	const [progress, setProgress] = useState<YearProgress | null>(null);
	// eslint-disable-next-line react-hooks/set-state-in-effect -- must run after hydration
	useEffect(() => setProgress(yearProgress()), []);
	return { ...(progress ?? PLACEHOLDER), ready: progress !== null };
}
