import { Textarea } from "@heroui/input";

export type Message = {
  type: "user" | "agent" | "error";
  content: string;
};

type ConversationProps = {
  messages: Message[];
};

const Conversation = ({ messages }: ConversationProps) => {
  const messageClasses = "text-black p-2 rounded-lg w-5/6";
  const userMessageClasses = "self-start";
  const agentMessageClasses = "self-end";
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {messages.map((message, index) => (
        <Textarea
          key={message.content + index}
          className={`${messageClasses} ${
            message.type === "user" ? userMessageClasses : agentMessageClasses
          }`}
          value={message.content}
          disabled
          readOnly
          isInvalid={message.type === "error"}
        />
      ))}
    </div>
  );
};

export default Conversation;
