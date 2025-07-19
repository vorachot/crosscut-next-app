import AddIcon from "@mui/icons-material/Add";

import ButtonClient from "@/components/button-client";
import TaskAccordion from "@/components/task-accordion";
import { Status } from "@/types/enum";
const page = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-5xl">Your Tasks</h1>
        <ButtonClient mode="tasks">
          <AddIcon />
          Tasks
        </ButtonClient>
      </div>

      <div className="flex flex-col gap-4">
        <TaskAccordion status={Status.running} title="task 1" />
        <TaskAccordion status={Status.stopped} title="task 2" />
      </div>
    </div>
  );
};

export default page;
