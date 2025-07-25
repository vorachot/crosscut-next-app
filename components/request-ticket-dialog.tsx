"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";
import { useState } from "react";
import { mutate } from "swr";

import SliderInput from "./slider-input";

import { requestTicket } from "@/api/ticket";
import { useNamespace } from "@/context/NamespaceContext";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  const { namespace_urn, glidelet_urn, namespace_id } = useNamespace();
  const [cpu, setCpu] = useState(1);
  const [gpu, setGpu] = useState(1);
  const [memory, setMemory] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestTicket(
        namespace_urn,
        glidelet_urn,
        namespace_id,
        cpu,
        gpu,
        memory,
      );

      if (setOnClose) setOnClose();
      await mutate(["tickets", namespace_id], undefined, { revalidate: true });
    } catch (err) {
      console.error("Ticket Request Failed:", err);
    }
  };

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
      <Form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <SliderInput label="CPU" maxValue={16} onValueChange={setCpu} />
        <SliderInput label="GPU" maxValue={8} onValueChange={setGpu} />
        <SliderInput label="Memory" maxValue={64} onValueChange={setMemory} />
        <Button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="submit"
        >
          Submit Request
        </Button>
      </Form>
    </Card>
  );
};

export default RequestTicketDialog;
