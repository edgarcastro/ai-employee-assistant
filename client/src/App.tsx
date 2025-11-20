import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import AgentInput from "./components/AgentInput";
import Conversation, { type Message } from "./components/Conversation";
import { formatErrorSocketMessage } from "./utils";

const agentUrl = import.meta.env.VITE_AGENT_URL;

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const isServerPending =
    messages.length > 0 && messages[messages.length - 1].type === "user";
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    return () => {
      const currentSocket = socketRef.current;
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, []);

  const handleSubmit = (message: string) => {
    setMessages((prev) =>
      prev.length > 0 && prev[prev.length - 1].type === "user"
        ? prev
        : [...prev, { type: "user", content: message }]
    );

    if (!socketRef.current || !socketRef.current.connected) {
      const newSocket = io(agentUrl, {
        transports: ["websocket"],
        autoConnect: true,
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        newSocket.emit("user_message", message);
      });

      newSocket.on("agent_message", (data) => {
        setMessages((prev) =>
          prev.length > 0 && prev[prev.length - 1].type === "agent"
            ? prev
            : [...prev, { type: "agent", content: data }]
        );
      });

      newSocket.on("connect_error", (error) => {
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].type === "error") {
            return prev;
          }
          const formattedError = formatErrorSocketMessage(error);

          return [...prev, { type: "error", content: formattedError }];
        });
      });

      newSocket.on("agent_error", (error) => {
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].type === "error") {
            return prev;
          }

          return [...prev, { type: "error", content: error }];
        });
      });
    } else if (socketRef.current.connected) {
      socketRef.current.emit("user_message", message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-dvh w-full max-w-4xl mx-auto gap-4 p-4 overflow-y-auto">
      {!messages.length && (
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-bold text-white">
            Welcome to the Agent
          </h1>
          <p className="text-white">
            This is a simple agent that can help you with your tasks.
          </p>
        </div>
      )}
      {messages.length > 0 && (
        <Conversation messages={messages} loading={isServerPending} />
      )}

      <AgentInput onSubmit={handleSubmit} loading={isServerPending} />
    </div>
  );
};

export default App;
