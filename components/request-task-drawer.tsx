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

import TicketTableClient from "./ticket-table-client";

type RequestTaskDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RequestTaskDrawer = ({ isOpen, onClose }: RequestTaskDrawerProps) => {
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="w-full max-h-80 overflow-y-auto">
                    <TicketTableClient
                      isDrawer={true}
                      selectionMode="multiple"
                    />
                  </div>
                </Form>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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
