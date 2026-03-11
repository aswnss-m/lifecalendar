<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/icon_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/icon_light.png">
    <img alt="LifeCalendar" src="./public/icon_dark.png" width="120" height="120">
  </picture>

  <h1>LifeCalendar</h1>
  <p><strong>Wallpapers for mindful living.</strong></p>
  <p>Visualize your year at a glance — every day counted, every day lived.</p>
</div>

---

## What is this?

LifeCalendar generates minimalist lock screen wallpapers that show your year as a grid of days. At a glance, you can see how many days have passed and how many remain — a quiet reminder to make each one count.

Every time you pick up your phone, you see where you are in the year.

## Features

- **Two layout styles** — flat grid or month-by-month calendar view
- **Fully customizable** — background, passed days, remaining days, stats colors, corner radius, grid size
- **Dark & light themes** — sensible defaults for both (`#121212` / `#FAF9F6`)
- **iOS & Android support** — step-by-step install instructions for each platform
- **Live preview** — see your wallpaper update in real time before downloading
- **Percentage stats** — optionally show days left and % complete on the wallpaper

## Tech Stack

- [Next.js](https://nextjs.org/) — App Router, React 19
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) + Radix UI — accessible UI components
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form state & validation
- [next-themes](https://github.com/pacocoursey/next-themes) — dark/light mode
- [html-to-image](https://github.com/bubkoo/html-to-image) — wallpaper export

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx                        # Home / landing page
└── types/
    └── days-in-year/
        ├── page.tsx                # OS picker (iOS / Android)
        ├── file/route.ts           # Image generation API route
        ├── ios/
        │   ├── page.tsx            # iOS preview + tabs
        │   └── tabs/
        │       ├── customize.tsx   # Color & grid customization
        │       └── install.tsx     # iOS install instructions
        └── android/                # Android variant
```

> Project is inspired from [The life Calender]("https://thelifecalendar.com")