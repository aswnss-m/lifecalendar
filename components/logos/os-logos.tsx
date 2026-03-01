import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

export function AndroidLogo({ className, ...rest }: ComponentProps<"svg">) {
    return (
        <svg
            // This tells the SVG: "Use the current CSS text color for everything inside"
            fill="currentColor"
            // 'w-6 h-6' is a safer default than 'w-full' for testing
            className={cn('w-6 h-6 text-foreground', className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            {...rest}
        >
            <path d="M380.91,199l42.47-73.57a8.63,8.63,0,0,0-3.12-11.76,8.52,8.52,0,0,0-11.71,3.12l-43,74.52c-32.83-15-69.78-23.35-109.52-23.35s-76.69,8.36-109.52,23.35l-43-74.52a8.6,8.6,0,1,0-14.88,8.64L131,199C57.8,238.64,8.19,312.77,0,399.55H512C503.81,312.77,454.2,238.64,380.91,199ZM138.45,327.65a21.46,21.46,0,1,1,21.46-21.46A21.47,21.47,0,0,1,138.45,327.65Zm235,0A21.46,21.46,0,1,1,395,306.19,21.47,21.47,0,0,1,373.49,327.65Z" />
        </svg>
    )
}

export function AppleLogo({ className, ...rest }: ComponentProps<"svg">) {
    return (
        <svg
            fill="currentColor"
            className={cn('w-6 h-6 text-foreground', className)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            {...rest}
        >
            <path d="M349.13,136.86c-40.32,0-57.36,19.24-85.44,19.24C234.9,156.1,212.94,137,178,137c-34.2,0-70.67,20.88-93.83,56.45-32.52,50.16-27,144.63,25.67,225.11,18.84,28.81,44,61.12,77,61.47h.6c28.68,0,37.2-18.78,76.67-19h.6c38.88,0,46.68,18.89,75.24,18.89h.6c33-.35,59.51-36.15,78.35-64.85,13.56-20.64,18.6-31,29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48Z" />
            <path d="M340.25,32c-24,1.63-52,16.91-68.4,36.86-14.88,18.08-27.12,44.9-22.32,70.91h1.92c25.56,0,51.72-15.39,67-35.11C333.17,85.89,344.33,59.29,340.25,32Z" />
        </svg>
    )
}