"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Form } from "@heroui/form";
import { NumberInput } from "@heroui/number-input";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  return (
    <Card className="w-[350px] px-5 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
        Request Resource
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-3">
        Project: <span>Project Name</span>
        <br />
        Namespace: <span>Namespace Name</span>
        <br />
        Resource Pool: <span>Resource Pool Name</span>
      </div>
      <Form>
        <NumberInput
          className="mt-4"
          label="CPU"
          max={16}
          min={0}
          placeholder="Enter CPU cores"
        />
        <NumberInput
          className="mt-4"
          label="GPU"
          max={8}
          min={0}
          placeholder="Enter GPU units"
        />
        <NumberInput
          className="mt-4"
          label="Memory"
          max={64}
          min={0}
          placeholder="Enter memory in GB"
        />
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
