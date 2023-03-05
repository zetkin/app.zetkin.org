import { PayloadAction } from '@reduxjs/toolkit';
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { Store } from 'core/store';

type SocketProviderProps = {
  children: ReactNode;
  store: Store;
};

const SocketContext = createContext<Socket | null>(null);

export type SocketPayload<D> = {
  data: D;
  name: string;
};

const SocketProvider: FC<SocketProviderProps> = ({ children, store }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      const socket = io({
        transports: ['websocket', 'polling'],
      });

      socket.on('personview.addrow', (data) => {
        store.dispatch<
          PayloadAction<SocketPayload<{ personId: number; viewId: number }>>
        >({
          payload: {
            data,
            name: 'personview.addrow',
          },
          type: 'socket',
        });
      });

      socket.on('personview.deleterow', (data) => {
        store.dispatch<
          PayloadAction<SocketPayload<{ personId: number; viewId: number }>>
        >({
          payload: {
            data,
            name: 'personview.deleterow',
          },
          type: 'socket',
        });
      });

      setSocket(socket);
    };

    initSocket();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };
