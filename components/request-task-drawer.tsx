"use client";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Selection } from "@heroui/table";
import { useState } from "react";
import { mutate } from "swr";

import TicketTableClient from "./ticket-table-client";

import { createTask } from "@/api/task";

type RequestTaskDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RequestTaskDrawer = ({ isOpen, onClose }: RequestTaskDrawerProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const hasSelectedTickets = selectedKeys !== "all" && selectedKeys.size > 0;

  const handleCreateTask = async () => {
    try {
      const ticketIds = Array.from(selectedKeys);

      await createTask(ticketIds);
      console.log("Creating task with ticket IDs:", ticketIds);
      onClose();
      await mutate(["tasks"], undefined, { revalidate: true });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} size="2xl" onOpenChange={onClose}>
        <DrawerContent className="p-4 bg-white dark:bg-gray-800">
          {(onClose) => (
            <>
              <DrawerHeader className="text-2xl font-semibold">
                New Task
              </DrawerHeader>
              <DrawerBody className="">
                <Form className="space-y-4">
                  <div className="flex gap-4 w-full">
                    <Input
                      isRequired
                      label="Task Name"
                      labelPlacement="outside"
                      placeholder="Enter task name"
                      variant="bordered"
                    />
                    <Input
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter description"
                      variant="bordered"
                    />
                  </div>

                  <div className="w-full max-h-96 overflow-y-auto">
                    <TicketTableClient
                      isDrawer={true}
                      selectedKeys={selectedKeys}
                      selectionMode="multiple"
                      onSelectionChange={setSelectedKeys}
                    />
                  </div>
                </Form>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={!hasSelectedTickets}
                  onPress={handleCreateTask}
                >
                  Create Task
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default RequestTaskDrawer;
