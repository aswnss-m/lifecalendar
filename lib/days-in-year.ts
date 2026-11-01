const DAY_MS = 1000 * 60 * 60 * 24;

// Fixed locale + UTC so server and browser render the same names and counts.
export function monthsData(year: number): { name: string; days: number }[] {
	return Array.from({ length: 12 }, (_, m) => ({
		name: new Date(Date.UTC(year, m, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
		days: new Date(Date.UTC(year, m + 1, 0)).getUTCDate(),
	}));
}

export function totalDays(year: number): number {
	return (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / DAY_MS;
}

/** Wall-clock date and time in `timeZone` (an IANA name). Undefined uses the runtime's zone; invalid names fall back to UTC. */
function wallClock(timeZone?: string) {
	const options: Intl.DateTimeFormatOptions = {
		timeZone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hourCycle: "h23",
	};
	let format: Intl.DateTimeFormat;
	try {
		format = new Intl.DateTimeFormat("en-US", options);
	} catch {
		format = new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" });
	}
	const parts = Object.fromEntries(
		format.formatToParts(new Date()).map((p) => [p.type, Number(p.value)]),
	);
	return parts as Record<"year" | "month" | "day" | "hour" | "minute" | "second", number>;
}

export type YearProgress = ReturnType<typeof yearProgress>;

export function yearProgress(timeZone?: string) {
	const now = wallClock(timeZone);
	// Whole days since Jan 1 in the given zone, so the count changes at local midnight.
	const passed = (Date.UTC(now.year, now.month - 1, now.day) - Date.UTC(now.year, 0, 1)) / DAY_MS;
	const total = totalDays(now.year);
	return {
		passed,
		total,
		daysLeft: total - passed,
		percentage: Math.round((passed / total) * 100),
		months: monthsData(now.year),
		// shortcut: ignores DST shifts, so the cache can expire up to an hour early or late on those two days a year.
		secondsUntilMidnight: 86400 - (now.hour * 3600 + now.minute * 60 + now.second),
	};
}
