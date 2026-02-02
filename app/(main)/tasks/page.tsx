"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import { useState } from "react";
import { Button } from "@heroui/button";
import { mutate } from "swr";

import ButtonClient from "@/components/button-client";
import TaskList from "@/components/task-list";
import { deleteTasks } from "@/api/task";

const Page = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTasks = async () => {
    if (selectedTasks.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedTasks.length} task(s)?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTasks(selectedTasks);
      // Revalidate the tasks list
      mutate(["tasks"]);
      setSelectedTasks([]);
      setSelectionMode(false);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
      alert("Failed to delete tasks. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center gap-7">
        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Your Tasks
          </h1>
          <div className="flex items-center gap-2">
            {selectionMode ? (
              <>
                <Button
                  color="danger"
                  isDisabled={selectedTasks.length === 0 || isDeleting}
                  isLoading={isDeleting}
                  startContent={<DeleteIcon />}
                  onPress={handleDeleteTasks}
                >
                  Delete ({selectedTasks.length})
                </Button>
                <Button
                  variant="bordered"
                  onPress={() => {
                    setSelectionMode(false);
                    setSelectedTasks([]);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  startContent={<ChecklistRtlIcon />}
                  variant="bordered"
                  onPress={() => setSelectionMode(true)}
                >
                  Select
                </Button>
                <ButtonClient mode="tasks">
                  <AddIcon />
                  Task
                </ButtonClient>
              </>
            )}
          </div>
        </div>
        <div className="h-full">
          <TaskList
            selectedTasks={selectedTasks}
            selectionMode={selectionMode}
            onSelectionChange={setSelectedTasks}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
