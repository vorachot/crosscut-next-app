"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import useSWR from "swr";

import TicketForm from "./ticketForm";

import { createTicketToCH } from "@/api/ticket";
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
    <Card className="w-[350px] px-5 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
      <Button
        className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
        onPress={() => setOnClose && setOnClose()}
      >
        ✕
      </Button>
      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Request Resource
      </div>
      <TicketForm
        createTicketToCH={createTicketToCH}
        namespace_id={namespace_id}
        quota={quota!}
        quota_id={quota_id}
        setOnClose={setOnClose}
      />
    </Card>
  );
};

export default RequestTicketDialog;
