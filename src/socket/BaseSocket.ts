/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
import io from 'socket.io-client';
import { getStorageJwtToken } from 'src/helpers/storage';
import { SocketEvent } from 'src/socket/SocketEvent';
import eventBus from './event-bus';

export class BaseSocket {
  private static instance: BaseSocket;
  private socket: any;

  public static getInstance(): BaseSocket {
    if (!BaseSocket.instance) {
      BaseSocket.instance = new BaseSocket();
    }

    return BaseSocket.instance;
  }

  public connect(): void {
    const accessToken = getStorageJwtToken();
    this.socket = io(process.env.REACT_APP_BASE_SOCKET as string, {
      transports: ['websocket'],
      query: {
        authorization: accessToken,
      },
    });
    this.socket.on('connect', () => {
      console.log('connect');
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('disconnect');
    });
    this.listen24TickerEvent();
  }

  public reconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.connect();
  }

  disconnectSocket(): void {
    this.socket.disconnect();
  }

  listen24TickerEvent(): void {
    this.socket.on(SocketEvent.Ticker24h, (data: any) => {
      eventBus.dispatch(SocketEvent.Ticker24h, data);
    });
  }
}
