import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unhatorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("No server ID", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }
    const server = await prismadb.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        chanels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Chanel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
