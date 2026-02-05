"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import { useState } from "react";
import { Button } from "@heroui/button";
import toast from "react-hot-toast";
import { mutate } from "swr";

import ButtonClient from "@/components/button-client";
import TicketTableClient from "@/components/ticket-table-client";
import { deleteTickets } from "@/api/ticket";

const Page = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTickets = async () => {
    if (selectedTickets.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedTickets.length} ticket(s)?`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTickets(selectedTickets);
      toast.success("Tickets deleted successfully");
      // Refresh ticket data
      await mutate(["tickets-history"]);
      setSelectedTickets([]);
      setSelectionMode(false);
    } catch (error) {
      console.error("Failed to delete tickets:", error);
      toast.error("Failed to delete tickets. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-7">
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
          Your Tickets
        </h1>
        <div className="flex items-center gap-2">
          {selectionMode ? (
            <>
              <Button
                color="danger"
                isDisabled={selectedTickets.length === 0 || isDeleting}
                isLoading={isDeleting}
                startContent={<DeleteIcon />}
                onPress={handleDeleteTickets}
              >
                Delete ({selectedTickets.length})
              </Button>
              <Button
                variant="bordered"
                onPress={() => {
                  setSelectionMode(false);
                  setSelectedTickets([]);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                startContent={<ChecklistRtlIcon />}
                variant="bordered"
                onPress={() => setSelectionMode(true)}
              >
                Select
              </Button>
              <ButtonClient>
                <AddIcon />
                Ticket
              </ButtonClient>
            </>
          )}
        </div>
      </div>
      <div className="h-full">
        <TicketTableClient
          pathTemplate="resourcepool-to-ticket"
          selectionMode={selectionMode ? "multiple" : "none"}
          selectedTickets={selectedTickets}
          onSelectionChange={(tickets) => {
            if (Array.isArray(tickets)) {
              setSelectedTickets(tickets);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Page;
