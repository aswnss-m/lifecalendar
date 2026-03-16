"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { UploadIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadCustomWallpaper } from "./actions";

interface StoredImage {
    id: string;
    url: string;
    createdAt: string;
}

interface Props {
    initialImages: StoredImage[];
}

export function CustomWallpaperClient({ initialImages }: Props) {
    const [images, setImages] = useState<StoredImage[]>(initialImages);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setStatus("idle");
    }

    function handleUpload() {
        if (!inputRef.current?.files?.[0]) return;
        const formData = new FormData();
        formData.append("file", inputRef.current.files[0]);

        startTransition(async () => {
            try {
                const result = await uploadCustomWallpaper(formData);
                setImages((prev) => [
                    { id: result.url, url: result.url, createdAt: new Date().toISOString() },
                    ...prev,
                ]);
                setStatus("success");
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
            } catch (err) {
                setStatus("error");
                setErrorMsg(err instanceof Error ? err.message : "Upload failed");
            }
        });
    }

    return (
        <div className="max-w-lg w-full flex flex-col gap-6">
            {/* Upload area */}
            <Card>
                <CardContent className="pt-6 flex flex-col items-center gap-4">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {preview ? (
                        <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-border">
                            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="w-full aspect-[9/16] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                        >
                            <UploadIcon className="h-8 w-8" />
                            <span className="text-sm">Click to select an image</span>
                            <span className="text-xs">PNG, JPG, WEBP</span>
                        </button>
                    )}

                    <div className="flex gap-2 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => inputRef.current?.click()}
                        >
                            {preview ? "Change image" : "Select image"}
                        </Button>
                        {preview && (
                            <Button
                                type="button"
                                className="flex-1"
                                disabled={isPending}
                                onClick={handleUpload}
                            >
                                {isPending ? "Uploading…" : "Upload"}
                            </Button>
                        )}
                    </div>

                    {status === "success" && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircleIcon className="h-4 w-4" />
                            Image uploaded successfully
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                            <XCircleIcon className="h-4 w-4" />
                            {errorMsg}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Previously uploaded images */}
            {images.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-medium">Your uploads</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {images.map((img) => (
                            <div key={img.id} className="relative aspect-[9/16] rounded-lg overflow-hidden border border-border">
                                <Image src={img.url} alt="Uploaded wallpaper" fill className="object-cover" unoptimized />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
