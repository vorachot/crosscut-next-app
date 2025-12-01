import AddIcon from "@mui/icons-material/Add";
import { Toaster } from "react-hot-toast";

import ButtonClient from "@/components/button-client";
import TaskList from "@/components/task-list";
const page = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <>
      <Toaster />
      <div className="flex flex-col justify-center gap-7">
        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Your Tasks
          </h1>
          <div className="flex items-center">
            <ButtonClient mode="tasks">
              <AddIcon />
              Task
            </ButtonClient>
          </div>
        </div>
        <div className="h-full">
          <TaskList />
        </div>
      </div>
    </>
  );
};

export default page;
