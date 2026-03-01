export function Footer() {
    return (
        <footer className="w-full border-t border-border/50 py-6">
            <p className="text-center text-sm text-muted-foreground">
                Made by{" "}
                <a
                    href="https://github.com/aswnss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline underline-offset-4"
                >
                    @aswnss
                </a>
                {", "}inspired by{" "}
                <a
                    href="https://thelifecalendar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline underline-offset-4"
                >
                    thelifecalendar.com
                </a>
            </p>
        </footer>
    );
}
