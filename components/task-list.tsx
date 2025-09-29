"use client";

import useSWR from "swr";
import { Assignment as TaskIcon } from "@mui/icons-material";

import TaskAccordion from "./task-accordion";

import { Status } from "@/types/enum";
import Loading from "@/app/loading";
import { getTasks } from "@/api/task";
import { formatDate } from "@/utils/helper";

const TaskList = () => {
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

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task, index) => (
        <TaskAccordion
          key={index}
          createdAt={formatDate(task.created_at)}
          id={task.id}
          status={Status.redeemed}
          tickets={task.tickets}
          title={task.title}
        />
      ))}
    </div>
  );
};

export default TaskList;
