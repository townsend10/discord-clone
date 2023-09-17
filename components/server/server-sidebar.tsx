import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/server-header";

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

  if (!server) {
    return redirect("/");
  }
  //Verfiy if you are a ADMIN ,GUEST, ETC

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div
      className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31]
  bg-[#F2F3F5 ] ">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
