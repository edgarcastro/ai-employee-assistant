import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type AgentInputProps = {
  onSubmit: (message: string) => void;
  loading?: boolean;
};

const AgentInput = ({ onSubmit, loading = false }: AgentInputProps) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message && message.trim() !== "") {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center w-full bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg gap-4"
      onSubmit={handleSubmit}
    >
      <Textarea
        name="message"
        placeholder={loading ? "Thinking..." : "Type your message..."}
        required
        minRows={2}
        disabled={loading}
        value={message}
        onValueChange={(e) => setMessage(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as React.FormEvent<HTMLFormElement>);
          }
        }}
      />
      <div className="flex flex-row items-center justify-end w-full">
        <Button
          variant="solid"
          color="primary"
          type="submit"
          isLoading={loading}
          isIconOnly
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default AgentInput;
