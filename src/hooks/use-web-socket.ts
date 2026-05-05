import { useEffect, useRef, useCallback, useState } from "react";
import { WSEvent, WSOutgoingEvent } from "@/types/chat";

const WS_URL = "wss://whisperbox.koyeb.app/ws";

export function useWebSocket(onEvent: (event: WSEvent) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const onEventRef = useRef(onEvent);

  // Update the ref every render so the latest callback is used without triggering reconnects
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(() => {
    const token = localStorage.getItem("wb_access_token");
    if (!token) return;

    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

    const socket = new WebSocket(`${WS_URL}?token=${token}`);

    socket.onopen = () => {
      console.log("WS Connected");
      setIsConnected(true);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    socket.onmessage = (event) => {
      try {
        const data: WSEvent = JSON.parse(event.data);
        onEventRef.current(data); // Use the ref
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    socket.onclose = (e) => {
      console.log(`WS Closed: ${e.code} ${e.reason}`);
      setIsConnected(false);
      // Attempt reconnect after 3 seconds if not intentionally closed
      if (e.code !== 1000) {
        reconnectTimeout.current = setTimeout(connect, 3000);
      }
    };

    socket.onerror = (err) => {
      console.error("WS Error", err);
    };

    ws.current = socket;
  }, []); // No dependencies, connect logic is stable

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
        const socket = ws.current;
        socket.onclose = null; // Prevent reconnect on unmount
        socket.close(1000);
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  return { isConnected, send };
}
