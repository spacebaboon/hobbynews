import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const themes = await prisma.theme.findMany({
    where: { isPublic: true },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });
  return NextResponse.json(themes);
}
