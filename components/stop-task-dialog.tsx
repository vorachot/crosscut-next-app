import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { mutate } from "swr";

import { stopTask } from "@/api/task";

type StopTaskDialogProps = {
  setOnClose?: () => void;
  taskId: string;
};
const StopTaskDialog = ({ setOnClose, taskId }: StopTaskDialogProps) => {
  const handleStop = async () => {
    try {
      await stopTask(taskId);

      if (setOnClose) setOnClose();
      await mutate(["tasks"], undefined, { revalidate: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Task Stopping Failed:", err);
    }
  };
  const handleCancel = () => {
    if (setOnClose) setOnClose();
  };

  return (
    <Card className="w-[350px] px-5 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
      <Button
        className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
        onPress={() => setOnClose && setOnClose()}
      >
        ✕
      </Button>
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
          Stop Task
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Are you sure you want to stop this task?
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          aria-label="Cancel"
          type="button"
          onPress={() => handleCancel()}
        >
          Cancel
        </Button>
        <Button
          aria-label="Stop Task"
          type="button"
          onPress={() => handleStop()}
        >
          Yes
        </Button>
      </div>
    </Card>
  );
};

export default StopTaskDialog;
