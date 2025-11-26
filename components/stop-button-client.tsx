import { useDisclosure } from "@chakra-ui/react";
import { Button } from "@heroui/button";
import { Stop } from "@mui/icons-material";

import StopTaskDialog from "./stop-task-dialog";

const StopButtonClient = ({ taskId }: { taskId: string }) => {
  const { open, onOpen, onClose } = useDisclosure();
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
          <StopTaskDialog setOnClose={onClose} taskId={taskId} />
        </div>
      )}
      <Button
        aria-label="Stop"
        color="danger"
        size="sm"
        variant="flat"
        onPress={() => handleClick()}
      >
        <div className="flex items-center gap-1">
          <Stop className="!w-5 !h-5" name="stop" />
          <span className="text-sm">Stop</span>
        </div>
      </Button>
    </>
  );
};

export default StopButtonClient;
