import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from '@vercel/og'
import { daysPassed, monthsData, totalDays } from "@/lib/days-in-year";
import { Iphone } from "@/lib/sizes";
import { createModelScaler } from "@/lib/utils";


export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
  const response = new ImageResponse(
    <div>Hello!</div>,
 {
  width: 1200,
  height: 630,
 }
  )
	  return response
}
