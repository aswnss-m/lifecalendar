import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const wallpapers = await prisma.wallpaper.findMany({
        where: { userId },
        include: { image: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Wallpapers</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {wallpapers.length === 0
                            ? "No wallpapers yet"
                            : `${wallpapers.length} wallpaper${wallpapers.length === 1 ? "" : "s"}`}
                    </p>
                </div>
                <Button asChild size="sm">
                    <Link href="/types/days-in-year/ios">
                        <PlusIcon className="size-4" />
                        New Wallpaper
                    </Link>
                </Button>
            </div>

            {wallpapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        You haven&apos;t created any wallpapers yet.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/types/days-in-year/ios">Create your first wallpaper</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wallpapers.map((wallpaper) => (
                        <Link
                            key={wallpaper.id}
                            href={`/wallpaper/${wallpaper.id}`}
                            className="group relative rounded-2xl overflow-hidden border border-border/50 hover:border-border transition-colors aspect-[9/19.5] bg-muted"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={wallpaper.image.url}
                                alt="Wallpaper background"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-xs font-medium truncate">
                                    iPhone {wallpaper.model}
                                </p>
                                <p className="text-white/60 text-xs">
                                    {new Date(wallpaper.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/50 rounded-full p-1">
                                    <ArrowRightIcon className="size-3 text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
