"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";

import SliderInput from "./slider-input";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  return (
    <Card className="w-[350px] px-5 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 relative">
      <Button
        className="absolute top-2 right-2 min-w-8 h-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full"
        onPress={() => {
          if (setOnClose) setOnClose();
        }}
      >
        ✕
      </Button>
      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Request Resource
      </div>
      <Form className="mt-4 flex flex-col gap-4">
        <SliderInput label="CPU" maxValue={16} />
        <SliderInput label="GPU" maxValue={8} />
        <SliderInput label="Memory" maxValue={64} />
        <Button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="submit"
          onPress={() => {
            if (setOnClose) setOnClose();
          }}
        >
          Submit Request
        </Button>
      </Form>
    </Card>
  );
};

export default RequestTicketDialog;
