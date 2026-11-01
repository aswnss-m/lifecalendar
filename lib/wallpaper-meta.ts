import z from "zod";

// Bounds match the sliders in the customize form. Bad or missing values fall back to defaults instead of failing.
const int = (min: number, max: number, fallback: number) =>
	z.coerce.number().int().min(min).max(max).catch(fallback);

const color = (fallback: string) =>
	z
		.string()
		.regex(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
		.transform((c) => `#${c.replace("#", "")}`)
		.catch(`#${fallback}`);

export const wallpaperMetaSchema = z.object({
	style: z.enum(["flat", "monthly"]).catch("flat"),
	boxWidth: int(10, 50, 25),
	columns: int(5, 20, 10),
	radius: int(0, 100, 0),
	showPercentage: z.union([z.boolean(), z.string()]).transform((v) => v !== false && v !== "false").catch(true),
	passedColor: color("ef4444"),
	leftColor: color("fecaca"),
	bgColor: color("6b7280"),
	daysLeftColor: color("ffffff"),
	percentColor: color("ffffff"),
	monthLabelColor: color("ffffff"),
	timeZone: z.string().max(64).optional().catch(undefined),
});

export type WallpaperMeta = z.infer<typeof wallpaperMetaSchema>;

export function parseWallpaperMeta(input: unknown): WallpaperMeta {
	return wallpaperMetaSchema.parse(input && typeof input === "object" ? input : {});
}
