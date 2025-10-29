import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/database";

type ReportType = "USER" | "REPLY" | "COMMENT" | "POST";
interface ReportRequest {
  message: string;
  type: ReportType;
  url: string;
  reason: string;
}

interface ReportResponse {
  success: boolean;
  message?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ReportResponse | { error: string }>> {
  try {
    const { message, type, url, reason }: ReportRequest = await req.json();

    if (!message || !type || !url || !reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await prisma.report.create({
      data: {
        message,
        type,
        reason,
        url
      }
    });

    return NextResponse.json({ success: true, message: "Report submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 });
  }
}