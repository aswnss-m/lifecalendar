import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Wallpapers for<br />
                <span className="text-muted-foreground">mindful living.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
                Visualize your year at a glance — every day counted, every day lived.
                Updates automatically on your lock screen.
            </p>
            <div className="mt-10">
                <Button asChild size="lg">
                    <Link href="/types/days-in-year">
                        Get started
                    </Link>
                </Button>
            </div>
        </div>
    );
}
