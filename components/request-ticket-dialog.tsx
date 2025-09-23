"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import useSWR from "swr";
import { Divider } from "@heroui/divider";

import TicketForm from "./ticketForm";

import { requestTicketToCH } from "@/api/ticket";
import { useNamespace } from "@/context/NamespaceContext";
import Loading from "@/app/loading";
import { Quota } from "@/types/resource";
import { getQuotasByNamespaceIdFromCH } from "@/api/quota";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  const { quota_id, namespace_id } = useNamespace();
  const { data, error, isLoading } = useSWR(
    ["quotas", namespace_id],
    () => getQuotasByNamespaceIdFromCH(namespace_id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading quotas</div>;
  const quotas: Quota[] = data.quotas || [];
  const quota = quotas.find((q) => q.id === quota_id);

  console.log("quota from dialog:", quota);

  return (
    <Modal isOpen={true} scrollBehavior="inside" size="sm" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold text-gray-700 gap-2 dark:text-gray-300">
              New Ticket
            </h2>
          </div>
        </ModalHeader>
        <Divider />
        <ModalBody className="px-1 pt-5">
          <TicketForm
            createTicketToCH={requestTicketToCH}
            namespace_id={namespace_id}
            quota={quota!}
            quota_id={quota_id}
            setOnClose={setOnClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RequestTicketDialog;
