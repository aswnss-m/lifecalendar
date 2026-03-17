"use client";

import { useRef, useState, useTransition } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { ImageIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Iphone } from "@/lib/sizes";
import { uploadCroppedImage, createWallpaper } from "@/app/types/days-in-year/ios/custom-wallpaper/actions";
import type { FormValues } from "@/app/types/days-in-year/ios/tabs/customize";

interface Props {
    model: keyof typeof Iphone;
    formValues: FormValues;
    style: "flat" | "monthly";
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
    return centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    );
}

async function extractCroppedBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0, 0,
        canvas.width,
        canvas.height
    );
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
}

export function CustomWallpaperBanner({ model, formValues, style }: Props) {
    const { isSignedIn, userId } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { width, height } = Iphone[model];
    const aspect = width / height;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setCrop(undefined);
        setCompletedCrop(undefined);
        const reader = new FileReader();
        reader.addEventListener("load", () => setImgSrc(reader.result?.toString() ?? ""));
        reader.readAsDataURL(file);
    }

    function handleChange() {
        setImgSrc("");
        setCrop(undefined);
        setCompletedCrop(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleOpenChange(v: boolean) {
        setOpen(v);
        if (!v) handleChange();
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width: w, height: h } = e.currentTarget;
        setCrop(centerAspectCrop(w, h, aspect));
    }

    function handleSet() {
        console.log("User Id ", userId);
        if (!completedCrop || !imgRef.current) return;
        startTransition(async () => {
            const blob = await extractCroppedBlob(imgRef.current!, completedCrop);
            if (!blob) return;
            const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
            const image = await uploadCroppedImage(dataUrl);
            const wallpaper = await createWallpaper(image.id, model, {
                ...formValues,
                style,
            });
            router.push(`/wallpaper/${wallpaper.id}`);
        });
    }

    return (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm max-w-lg w-full">
            <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
                <p className="text-primary/80 font-medium leading-tight">Custom background image</p>
                <p className="text-xs text-primary/50 mt-0.5">
                    Recommended: {width} × {height}px
                </p>
            </div>

            {isSignedIn ? (
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="default">Upload</Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden">
                        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
                            <DialogTitle className="text-sm font-semibold">
                                Custom Wallpaper
                                <span className="ml-2 text-xs font-normal text-muted-foreground">
                                    {width} × {height}px
                                </span>
                            </DialogTitle>
                        </DialogHeader>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {imgSrc ? (
                            <>
                                <div className="overflow-auto max-h-[60vh] bg-black/5 flex items-center justify-center p-3">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, pct) => setCrop(pct)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        keepSelection
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            ref={imgRef}
                                            src={imgSrc}
                                            alt="Crop"
                                            onLoad={onImageLoad}
                                            style={{ maxHeight: "55vh", width: "auto", display: "block" }}
                                        />
                                    </ReactCrop>
                                </div>
                                <div className="flex gap-2 px-4 py-3 border-t border-border">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleChange}
                                        disabled={isPending}
                                    >
                                        Change
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={handleSet}
                                        disabled={isPending || !completedCrop}
                                    >
                                        {isPending ? "Uploading…" : "Set"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-muted-foreground hover:bg-muted/30 transition-colors w-full"
                            >
                                <UploadIcon className="size-8 opacity-50" />
                                <div className="text-center">
                                    <p className="text-sm font-medium">Tap to select an image</p>
                                    <p className="text-xs opacity-60 mt-0.5">PNG, JPG, WEBP</p>
                                </div>
                            </button>
                        )}
                    </DialogContent>
                </Dialog>
            ) : (
                <SignInButton forceRedirectUrl={pathname}>
                    <Button size="sm" variant="default">Sign in</Button>
                </SignInButton>
            )}
        </div>
    );
}
