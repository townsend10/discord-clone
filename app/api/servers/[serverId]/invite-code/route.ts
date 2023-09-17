import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { v4 as uuidv4, v4 } from "uuid";
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unhathorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVERID", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
