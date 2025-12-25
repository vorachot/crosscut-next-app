import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { mutate } from "swr";
import { toast, Toaster } from "react-hot-toast";

import { cancelTask } from "@/api/task";

type CancelTaskDialogProps = {
  setOnClose?: () => void;
  taskId: string;
};
const CancelTaskDialog = ({ setOnClose, taskId }: CancelTaskDialogProps) => {
  const handleCancel = async () => {
    try {
      await cancelTask(taskId);
      toast.success("Task cancelled successfully.");
      if (setOnClose) setOnClose();
      await mutate(["tasks"], undefined, { revalidate: true });
    } catch (err) {
      toast.error("Failed to cancel task. Please try again.: " + err);
    }
  };
  const handleClose = () => {
    if (setOnClose) setOnClose();
  };

  return (
    <>
      <Toaster />
      <Card className="w-[350px] px-5 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
        <Button
          className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
          onPress={() => setOnClose && setOnClose()}
        >
          ✕
        </Button>
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Cancel Task
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel this task?
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            aria-label="Close"
            type="button"
            onPress={() => handleClose()}
          >
            No
          </Button>
          <Button
            aria-label="Cancel Task"
            color="danger"
            type="button"
            onPress={() => handleCancel()}
          >
            Yes
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CancelTaskDialog;
