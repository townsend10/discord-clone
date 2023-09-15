import { currentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unhathorized", { status: 401 });
    }

    const server = await prismadb.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        chanels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POSTS]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
