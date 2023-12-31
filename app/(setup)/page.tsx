import InitalModal from "@/components/modals/initial-modal";
import { initalProfile } from "@/lib/inital-profile";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initalProfile();

  //Procura o server do usuario
  const server = await prismadb.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return <InitalModal />;
};

export default SetupPage;
