import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      chanels: {
        where: {
          name: "general  ",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initalChannel = server?.chanels[0];

  if (initalChannel?.name !== "general") {
    return null;
  }
  return redirect(`/servers/${params.serverId}/channels/${initalChannel?.id}`);
};

export default ServerIdPage;
