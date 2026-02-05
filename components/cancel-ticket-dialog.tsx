import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { mutate } from "swr";
import { toast } from "react-hot-toast";

import { cancelTicket } from "@/api/ticket";

type CancelTicketDialogProps = {
  setOnClose?: () => void;
  ticketId: string;
  nsId: string;
  resourcePoolId?: string;
  open: boolean;
};
const CancelTicketDialog = ({
  setOnClose,
  ticketId,
  nsId,
  resourcePoolId,
  open,
}: CancelTicketDialogProps) => {
  const handleCancelTicket = async () => {
    try {
      await cancelTicket(ticketId);
      toast.success("Ticket cancelled successfully!");
      if (setOnClose) setOnClose();
      await mutate(["tickets", nsId], undefined, { revalidate: true });
      await mutate(["tickets-history"], undefined, { revalidate: true });
      await mutate(["quota-usage", nsId, resourcePoolId], undefined, {
        revalidate: true,
      });
    } catch (err: any) {
      // Extract the actual error message from the response
      let errorMessage = "Failed to cancel ticket. Please try again.";

      if (err?.response?.data?.message) {
        // Server returned a specific error message
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // Alternative error field
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        // Fallback to general error message
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    }
  };
  const handleCancel = () => {
    if (setOnClose) setOnClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[400px] px-5 py-5 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
        <Button
          className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
          onPress={() => setOnClose && setOnClose()}
        >
          ✕
        </Button>
        <div className="flex flex-col items-center gap-5">
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Cancel Ticket
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-center">
            Are you sure you want to cancel this ticket?
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button
            aria-label="Cancel"
            type="button"
            variant="bordered"
            onPress={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            aria-label="Cancel Ticket"
            color="danger"
            type="button"
            onPress={() => handleCancelTicket()}
          >
            Yes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CancelTicketDialog;
