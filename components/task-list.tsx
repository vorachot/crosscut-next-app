"use client";

import useSWR from "swr";

import TaskAccordion from "./task-accordion";

import { Status } from "@/types/enum";
import Loading from "@/app/loading";
import { getTasks } from "@/api/task";

const TaskList = () => {
  const { data, error, isLoading } = useSWR(["tasks"], () => getTasks(), {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tasks</div>;

  const tasks: any[] = data?.Tasks ?? [];

  if (tasks.length === 0) {
    return <div className="text-gray-500">No tasks available</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task, index) => (
        <TaskAccordion
          key={index}
          createdAt={new Date(task.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // 24-hour format
          })}
          status={Status.active}
          tickets={task.ticket}
          title={task.id}
        />
      ))}
    </div>
  );
};

export default TaskList;
