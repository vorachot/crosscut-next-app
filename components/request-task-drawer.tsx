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
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Selection } from "@heroui/table";
import { useState } from "react";
import { mutate } from "swr";
import {
  Assignment as TaskIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import TicketTableClient from "./ticket-table-client";

import { createTask } from "@/api/task";

type RequestTaskDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RequestTaskDrawer = ({ isOpen, onClose }: RequestTaskDrawerProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [taskName, setTaskName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ taskName?: string; tickets?: string }>(
    {},
  );

  const hasSelectedTickets = selectedKeys !== "all" && selectedKeys.size > 0;
  const selectedCount = selectedKeys === "all" ? 0 : selectedKeys.size;

  // Validation
  const validateForm = () => {
    const newErrors: { taskName?: string; tickets?: string } = {};

    if (!taskName.trim()) {
      newErrors.taskName = "Task name is required";
    } else if (taskName.trim().length < 3) {
      newErrors.taskName = "Task name must be at least 3 characters";
    }

    if (!hasSelectedTickets) {
      newErrors.tickets = "Please select at least one ticket";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      const ticketIds = Array.from(selectedKeys);
      const taskData = {
        title: taskName,
        tickets: ticketIds,
      };

      await createTask(taskData);

      // Reset form
      setTaskName("");
      setSelectedKeys(new Set());
      setErrors({});
      onClose();

      await mutate(["tasks"], undefined, { revalidate: true });
    } catch {
      setErrors({ tickets: "Failed to create task. Please try again." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTaskName("");
    setSelectedKeys(new Set());
    setErrors({});
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} size="lg" onOpenChange={handleClose}>
      <DrawerContent className="bg-white dark:bg-gray-800">
        <DrawerHeader className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TaskIcon className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Task
            </h2>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure your task settings and select tickets
            </p> */}
          </div>
        </DrawerHeader>

        <DrawerBody className="px-6 py-5">
          {/* Task Configuration Section */}
          <div className="space-y-4 w-full">
            <Form className="space-y-4 w-full">
              <div>
                <div className="space-y-2 w-full">
                  <Input
                    isRequired
                    errorMessage={errors.taskName}
                    isInvalid={!!errors.taskName}
                    label="Task Name"
                    labelPlacement="outside"
                    placeholder="e.g. My First Task"
                    value={taskName}
                    variant="bordered"
                    onChange={(e) => {
                      setTaskName(e.target.value);
                      if (errors.taskName) {
                        setErrors((prev) => ({ ...prev, taskName: undefined }));
                      }
                    }}
                  />
                </div>
                {/* <div className="space-y-2">
                  <Input
                    label="Description (Optional)"
                    labelPlacement="outside"
                    placeholder="e.g. This task involves..."
                    value={description}
                    variant="bordered"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div> */}
              </div>
            </Form>
          </div>

          <Divider />

          {/* Ticket Selection Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between h-8">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-300">
                  Select Tickets
                </h3>
                {hasSelectedTickets && (
                  <Chip color="primary" size="sm" variant="flat">
                    {selectedCount} selected
                  </Chip>
                )}
              </div>

              {errors.tickets && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <WarningIcon className="!w-4 !h-4" />
                  <span className="text-sm">{errors.tickets}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <InfoIcon className="!w-4 !h-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select one or more available tickets to include in your task
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <TicketTableClient
                  isDrawer={true}
                  selectedKeys={selectedKeys}
                  selectionMode="multiple"
                  onSelectionChange={setSelectedKeys}
                />
              </div>
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {hasSelectedTickets ? (
              <>
                <CheckIcon className="!w-4 !h-4 text-green-500" />
                <span>
                  {selectedCount} ticket{selectedCount !== 1 ? "s" : ""}{" "}
                  selected
                </span>
              </>
            ) : (
              <>
                <InfoIcon className="!w-4 !h-4" />
                <span>Please select ticket</span>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              color="default"
              startContent={<CloseIcon className="!w-4 !h-4" />}
              variant="light"
              onPress={handleClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!hasSelectedTickets || !taskName.trim()}
              isLoading={isCreating}
              startContent={!isCreating && <CheckIcon className="!w-4 !h-4" />}
              onPress={handleCreateTask}
            >
              {isCreating ? "Creating Task..." : "Create Task"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RequestTaskDrawer;
