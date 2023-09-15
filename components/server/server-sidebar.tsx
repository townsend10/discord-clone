import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      chanels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.chanels.filter(
    (chanel) => chanel.type === ChannelType.TEXT
  );
  const audioChannels = server?.chanels.filter(
    (chanel) => chanel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.chanels.filter(
    (chanel) => chanel.type === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  return <div>server side bar</div>;
};

export default ServerSidebar;
