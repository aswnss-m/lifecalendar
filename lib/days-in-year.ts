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
