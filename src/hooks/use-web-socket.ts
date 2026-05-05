import { useEffect, useRef, useCallback, useState } from "react";
import { WSEvent, WSOutgoingEvent } from "@/types/chat";

const WS_URL = "wss://whisperbox.koyeb.app/ws";

export function useWebSocket(onEvent: (event: WSEvent) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("wb_access_token");
    if (!token) return;

    if (ws.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(`${WS_URL}?token=${token}`);

    socket.onopen = () => {
      console.log("WS Connected");
      setIsConnected(true);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    socket.onmessage = (event) => {
      try {
        const data: WSEvent = JSON.parse(event.data);
        onEvent(data);
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    socket.onclose = () => {
      console.log("WS Disconnected");
      setIsConnected(false);
      // Attempt reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    socket.onerror = (err) => {
      console.error("WS Error", err);
    };

    ws.current = socket;
  }, [onEvent]);

  const send = useCallback((event: WSOutgoingEvent) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(event));
    } else {
      console.warn("WS not connected, cannot send");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.onclose = null; // Prevent reconnect on intentional unmount
        ws.current.close();
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  return { isConnected, send };
}
