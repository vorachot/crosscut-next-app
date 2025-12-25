import { useState } from "react";
import { Button } from "@heroui/button";
import { Cancel } from "@mui/icons-material";
import CancelTaskDialog from "./cancel-task-dialog";

const CancelButtonClient = ({ taskId }: { taskId: string }) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleClick = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <CancelTaskDialog setOnClose={onClose} taskId={taskId} />
        </div>
      )}
      <Button
        aria-label="Cancel"
        color="danger"
        size="sm"
        variant="flat"
        onPress={() => handleClick()}
      >
        <div className="flex items-center gap-1">
          <Cancel className="!w-5 !h-5" name="cancel" />
          <span className="text-sm">Cancel</span>
        </div>
      </Button>
    </>
  );
};

export default CancelButtonClient;
