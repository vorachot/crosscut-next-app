import AddIcon from "@mui/icons-material/Add";

import ButtonClient from "@/components/button-client";
import TaskList from "@/components/task-list";
const page = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-5xl">Your Tasks</h1>
        <div className="flex items-center">
          <ButtonClient mode="tasks">
            <AddIcon />
            Task
          </ButtonClient>
        </div>
      </div>

      <TaskList />
    </div>
  );
};

export default page;
