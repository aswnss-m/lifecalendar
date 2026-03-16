"use client";

import { useRef, useState } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ImageIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export function CustomWallpaperBanner() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {   
            setFile(file);
        } else {
            setFile(null);
        }
    }
    return (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm max-w-lg w-full">
            <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
            <p className="flex-1 text-primary/80">
                Want a custom background image for your wallpaper?
            </p>
            {/* {isSignedIn ? (
                <Button asChild size="sm" variant="default">
                    <Link href="/types/days-in-year/ios/custom-wallpaper">
                        Upload
                    </Link>
                </Button>
            ) : (
                <SignInButton forceRedirectUrl={pathname}>
                    <Button size="sm" variant="default">
                        Sign in
                    </Button>
                </SignInButton>
            )} */}

            <Dialog>
                <DialogTrigger asChild>
                <Button size="sm" variant="default">
                    Upload
                </Button>
                </DialogTrigger>
                <DialogContent className={"border-dashed"}>
                <DialogHeader>
                    <DialogTitle className={"text-sm "}>Upload Custom Wallpaper</DialogTitle>
                </DialogHeader>
                {
                    file ? (
                        <div className="flex flex-col items-center gap-2 h-full flex-1">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt="Custom Wallpaper"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                            <Button size="sm" variant="default">
                                Change image
                            </Button>
                            <Button size="sm" variant="default">
                                Upload
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center gap-2 justify-center h-full cursor-pointer py-5 px-4 hover:bg-muted/30 rounded-lg"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-1 pointer-events-none">
                                <UploadIcon className="size-5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Click to select an image</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                id="custom-wallpaper-upload"
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                            />
                        </div>
                    )
                        }
                </DialogContent>
            </Dialog>
        </div>
    );
}
