"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import SliderInput from "./slider-input";

import { createTicketToCH } from "@/api/ticket";
import { useNamespace } from "@/context/NamespaceContext";
import { RequestTicketPayload } from "@/types/payload";
import Loading from "@/app/loading";
import { Quota } from "@/types/resource";
import {
  getQuotasByNamespaceIdFromCH,
  getResourceDetailByResourceIdFromCH,
} from "@/api/namespace";
import TicketForm from "./ticketForm";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  const { quota_id, namespace_id } = useNamespace();
  // const [cpu, setCpu] = useState(1);
  // const [gpu, setGpu] = useState(1);
  // const [memory, setMemory] = useState(1);
  const { data, error, isLoading } = useSWR(
    ["quotas", namespace_id],
    () => getQuotasByNamespaceIdFromCH(namespace_id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const quotas: Quota[] = data || [];
  const quota = quotas.find((q) => q.id === quota_id);
  // const resources = quota?.resources;
  // const resourceDetails = resources?.map((res) => ({
  //   ...res,
  //   resourceDetail: getResourceDetailByResourceIdFromCH(
  //     res.resource_prop.resource_id,
  //   ),
  // }));

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading quotas</div>;

  // const requestTicketPayload: RequestTicketPayload = {
  //   name: "default-ticket",
  //   namespace_id: namespace_id,
  //   quota_id: quota_id,
  //   resources: [
  //     {
  //       quantity: cpu,
  //       resource_id: "91fe814d-58fe-478e-a52f-4e5ed5412e70",
  //     },
  //     {
  //       quantity: gpu,
  //       resource_id: "a70b2266-6cb9-44ee-af09-dde1f4137921",
  //     },
  //     {
  //       quantity: memory,
  //       resource_id: "e17ac922-a4ca-48ef-befa-f617d5d917b8",
  //     },
  //   ],
  //   duration: 2,
  // };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await createTicketToCH(requestTicketPayload);

  //     if (setOnClose) setOnClose();
  //     await mutate(["tickets", namespace_id], undefined, { revalidate: true });
  //   } catch {}
  // };

  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log("resources:", resources);
  //   // eslint-disable-next-line no-console
  //   console.log("resourcesDetails:", resourceDetails);
  // }, [resources, resourceDetails]);

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
      {/* <Form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <SliderInput label="CPU" maxValue={16} onValueChange={setCpu} />
        <SliderInput label="GPU" maxValue={8} onValueChange={setGpu} />
        <SliderInput label="Memory" maxValue={64} onValueChange={setMemory} />
        <Button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="submit"
        >
          Submit Request
        </Button>
      </Form> */}
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
