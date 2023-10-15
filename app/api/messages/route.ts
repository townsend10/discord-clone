import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;
export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unhatorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prismadb.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          chanelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          chanelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    //Fetch the current messages
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("MESSAGES GET", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
