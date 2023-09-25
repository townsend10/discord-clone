import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { UserProfile } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    // const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unhatorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("No Server ID", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("no channel Id", { status: 400 });
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
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANEL DELETE ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    // const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unhatorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("No Server ID", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("no channel Id", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse('Name cannot be "general"', { status: 400 });
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("CHANEL PATCH ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
