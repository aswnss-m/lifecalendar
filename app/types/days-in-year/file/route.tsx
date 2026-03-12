import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from '@vercel/og'
import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";
import { createModelScaler } from "@/lib/utils";


export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
  const font = await fetch(new URL("/Inter-variable.ttf", import.meta.url)).then(res => res.arrayBuffer());
  const response = new ImageResponse(
    <div>Hello!</div>,
 {
  width: 1200,
  height: 630,
  fonts: [
    {
      "name": "Inter",
      "data": font,
      "style": "normal",
      "weight": 400,
    }
  ]
 }
  )
	  return response
}
