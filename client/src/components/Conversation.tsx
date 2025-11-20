import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { AnimatePresence, motion } from "framer-motion";

export type Message = {
  type: "user" | "agent" | "error";
  content: string;
};

type ConversationProps = {
  messages: Message[];
  loading?: boolean;
};

const Conversation = ({ messages, loading = false }: ConversationProps) => {
  const messageClasses = "text-black p-2 rounded-lg w-5/6";
  const userMessageClasses = "self-start";
  const agentMessageClasses = "self-end";
  return (
    <ul className="flex flex-col items-center justify-center w-full gap-2">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.li
            key={message.content + index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`${messageClasses} ${
              message.type === "user" ? userMessageClasses : agentMessageClasses
            }`}
          >
            <Textarea
              key={message.content + index}
              value={message.content}
              isDisabled
              isReadOnly
              variant="faded"
              isInvalid={message.type === "error"}
            />
          </motion.li>
        ))}
        {loading && (
          <motion.li
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="self-end flex items-center justify-center rounded-2xl bg-white/70 p-2 shadow-lg"
          >
            <Spinner variant="dots" />
          </motion.li>
        )}
      </AnimatePresence>
    </ul>
  );
};

export default Conversation;
