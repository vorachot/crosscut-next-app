"use client";

import TaskAccordion from "./task-accordion";

import { Status } from "@/types/enum";

const TaskList = () => {
  return (
    <div className="flex flex-col gap-4">
      <TaskAccordion status={Status.running} title="task 1" />
      <TaskAccordion status={Status.stopped} title="task 2" />
    </div>
  );
};

export default TaskList;
