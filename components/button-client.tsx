"use client";

import { Button } from "@heroui/button";
import { useState } from "react";

import RequestTicketDialog from "./request-ticket-dialog";
import RequestTaskDrawer from "./request-task-drawer";

type ButtonClientProps = {
  children?: React.ReactNode;
  mode?: "tasks" | "tickets";
};

const ButtonClient = ({ children, mode }: ButtonClientProps) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleClick = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <>
      {open && mode === "tickets" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <RequestTicketDialog setOnClose={onClose} />
        </div>
      )}
      {open && mode === "tasks" && (
        <RequestTaskDrawer isOpen={open} onClose={onClose} />
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
