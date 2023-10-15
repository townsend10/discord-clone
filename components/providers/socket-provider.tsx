"use client";

import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket?: Socket;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

// const SocketContext = createContext({});
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  //   const [socket, setSocket] = useState<any>();
  const [socket, setSocket] = useState<Socket>();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let currentSocket = socket;

    if (!currentSocket) {
      currentSocket = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
        path: "/api/socket/io",
        addTrailingSlash: false,
      });
      currentSocket.on("connect", () => {
        setIsConnected(true);
      });

      currentSocket.on("disconnect", () => {
        setIsConnected(false);
      });
      setSocket(currentSocket);
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
