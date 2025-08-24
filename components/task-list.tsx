"use client";

import useSWR from "swr";

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

  const tasks: any[] = data?.Tasks ?? [];

  if (tasks.length === 0) {
    return <div className="text-gray-500">No tasks available</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task, index) => (
        <TaskAccordion
          key={index}
          createdAt={formatDate(task.created_at)}
          id={task.id}
          status={Status.active}
          tickets={task.ticket}
          // title={task.id}
        />
      ))}
    </div>
  );
};

export default TaskList;
