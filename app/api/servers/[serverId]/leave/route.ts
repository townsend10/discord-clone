import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unhathrozed", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("No server ID", { status: 400 });
    }

    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("LEAVE ERROS PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
