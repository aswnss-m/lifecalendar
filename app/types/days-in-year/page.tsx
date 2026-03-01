import { AndroidLogo, AppleLogo } from "@/components/logos/os-logos";
import { Card, CardContent } from "@/components/ui/card";
import { IconApple } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function DaysInYearPage() {
    return (
        <section className={'w-full grow h-full flex justify-center items-center'}>
            <div className="flex flex-col items-center justify-center gap-2">
                <h1 className={'text-muted-foreground'}>Select your OS</h1>
                <div className="flex gap-4 items-center justify-center flex-wrap">
                    <Link href={'/types/days-in-year/ios'}>
                        <Card className={'aspect-square size-25 items-center justify-center cursor-pointer group hover:bg-accent'}>
                            <CardContent className={'items-center justify-center p-2'}>
                                <AppleLogo className={'size-12 text-foreground group-hover:text-accent-foreground  transition-colors'} />
                                <h1 className={'text-center font-semibold'}>ios</h1>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={'/types/days-in-year/android'}>
                        <Card className={'aspect-square size-25 items-center justify-center cursor-pointer group hover:bg-accent'}>
                            <CardContent className={'items-center justify-center flex flex-col p-2'}>
                                <AndroidLogo className={'size-12 text-foreground group-hover:text-accent-foreground transition-colors'} />
                                <h1 className={'text-center font-semibold'}>android</h1>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    );
}