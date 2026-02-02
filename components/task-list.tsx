"use client";

import useSWR from "swr";
import { Assignment as TaskIcon } from "@mui/icons-material";
import { Checkbox } from "@heroui/checkbox";

import TaskAccordion from "./task-accordion";

import { Status } from "@/types/enum";
import Loading from "@/app/loading";
import { getTasks } from "@/api/task";
import { formatDate } from "@/utils/helper";

type TaskListProps = {
  selectionMode?: boolean;
  selectedTasks?: string[];
  onSelectionChange?: (taskIds: string[]) => void;
};

const TaskList = ({
  selectionMode = false,
  selectedTasks = [],
  onSelectionChange,
}: TaskListProps) => {
  const { data, error, isLoading } = useSWR(["tasks"], () => getTasks(), {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tasks</div>;

  const tasks: any[] = data?.tasks ?? [];

  if (tasks.length === 0) {
    return (
      <div className="h-[300px] flex flex-col justify-center items-center text-center opacity-50">
        <TaskIcon className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No Running Tasks
        </h3>
      </div>
    );
  }

  const handleTaskSelection = (taskId: string, isSelected: boolean) => {
    if (!onSelectionChange) return;

    if (isSelected) {
      onSelectionChange([...selectedTasks, taskId]);
    } else {
      onSelectionChange(selectedTasks.filter((id) => id !== taskId));
    }
  };

  const isTaskDeletable = (status: Status) => {
    return (
      status === Status.stopped ||
      status === Status.expired ||
      status === Status.failed
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center gap-3">
          {selectionMode && (
            <Checkbox
              isDisabled={!isTaskDeletable(task.status as Status)}
              isSelected={selectedTasks.includes(task.id)}
              onValueChange={(isSelected) =>
                handleTaskSelection(task.id, isSelected)
              }
            />
          )}
          <div className="flex-1">
            <TaskAccordion
              createdAt={formatDate(task.created_at)}
              id={task.id}
              status={task.status as Status}
              tickets={task.tickets}
              title={task.title}
              estimatedStartTime={formatDate(task.estimated_start_time)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
