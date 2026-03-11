export function monthsData(year?: number): { name: string; days: number }[] {
	const y = year ?? new Date().getFullYear();
	return Array.from({ length: 12 }, (_, m) => ({
		name: new Date(y, m, 1).toLocaleString("default", { month: "short" }),
		days: new Date(y, m + 1, 0).getDate(),
	}));
}

export function totalDays(year?: number): number {
	const y = year ?? new Date().getFullYear();
	const startDate = new Date(y, 0, 1);
	const endDate = new Date(y + 1, 0, 1);

	const diff = endDate.getTime() - startDate.getTime();

	// Use Math.round to protect against DST offsets
	return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function daysPassed(): number {
	const startOfYear = new Date(new Date().getFullYear(), 0, 1);
	const now = new Date();

	const diff = Math.round(now.getTime() - startOfYear.getTime());

	return Math.round(diff / (1000 * 60 * 60 * 24));
}
