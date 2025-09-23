"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@chakra-ui/hooks";

import RequestTicketDialog from "./request-ticket-dialog";
import RequestTaskDrawer from "./request-task-drawer";

type ButtonClientProps = {
  children?: React.ReactNode;
  mode?: "tasks" | "tickets";
};

const ButtonClient = ({ children, mode }: ButtonClientProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleClick = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <>
      {isOpen && mode === "tickets" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <RequestTicketDialog setOnClose={onClose} />
        </div>
      )}
      {isOpen && mode === "tasks" && (
        <RequestTaskDrawer isOpen={isOpen} onClose={onClose} />
      )}
      <Button
        className="gap-0"
        color="primary"
        radius="md"
        onPress={handleClick}
      >
        {children}
      </Button>
    </>
  );
};

export default ButtonClient;
