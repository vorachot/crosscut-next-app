"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

import SliderInput from "./slider-input";

import { RequestTicketPayload } from "@/types/payload";
import { Quota } from "@/types/resource";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";

type TicketFormProps = {
  namespace_id: string;
  quota_id: string;
  quota: Quota;
  createTicketToCH: (payload: RequestTicketPayload) => Promise<any>;
  setOnClose?: () => void;
};

const TicketForm = ({
  namespace_id,
  quota_id,
  quota,
  createTicketToCH,
  setOnClose,
}: TicketFormProps) => {
  const [resourceDetails, setResourceDetails] = useState<any[]>([]);
  const [resourceValues, setResourceValues] = useState<Record<string, number>>(
    {},
  );
  const [ticketName, setTicketName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (resource_id: string, value: number) => {
    setResourceValues((prev) => ({
      ...prev,
      [resource_id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestTicketPayload: RequestTicketPayload = {
      name: ticketName || "default-ticket",
      namespace_id,
      quota_id,
      resources: Object.entries(resourceValues).map(
        ([resource_id, quantity]) => ({
          resource_id,
          quantity,
        }),
      ),
      duration: 2,
    };

    try {
      await createTicketToCH(requestTicketPayload);
      if (setOnClose) setOnClose();
      await mutate(["tickets", namespace_id], undefined, { revalidate: true });
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  // const getTotalResourcesSelected = () => {
  //   return Object.values(resourceValues).reduce((sum, val) => sum + val, 0);
  // };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!quota) return;

      const details = await Promise.all(
        quota.resources.map((res) =>
          getResourceDetailByResourceIdFromCH(res.resource_prop.resource_id),
        ),
      );

      const merged = quota.resources.map((res, i) => ({
        ...res,
        detail: details[i],
      }));

      setResourceDetails(merged);
    };

    fetchDetails();
  }, [quota]);

  return (
    <div className="px-6">
      <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Ticket Details Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-300">
            Ticket Name
          </h3>
          <Input
            isRequired
            classNames={{
              input: "text-gray-700 dark:text-gray-200",
              label: "text-gray-600 dark:text-gray-300",
            }}
            placeholder="Enter ticket name"
            value={ticketName}
            variant="bordered"
            onValueChange={setTicketName}
          />
          {/* {getTotalResourcesSelected() > 0 && (
            <Chip color="primary" size="sm" variant="flat">
              {getTotalResourcesSelected()} resources selected
            </Chip>
          )} */}
        </div>

        {/* Resources Section */}
        <div className="w-full space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-300">
            Select Resources
          </h3>

          <div className="space-y-4">
            {resourceDetails.map((res) => (
              <Card
                key={res.resource_prop.resource_id}
                className="border border-gray-200 dark:border-gray-700"
              >
                <CardBody className="p-4">
                  <SliderInput
                    label={`${res.detail.resource.resource_type.name} (${res.detail.resource.name})`}
                    maxValue={res.quantity}
                    onValueChange={(val) =>
                      handleValueChange(res.resource_prop.resource_id, val)
                    }
                  />
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Available: {res.quantity}</span>
                    <span>
                      Selected:{" "}
                      {resourceValues[res.resource_prop.resource_id] || 0}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        {/* Submit Section */}
        <div className="w-full flex justify-end gap-2">
          <Button
            className="w-24"
            color="primary"
            isDisabled={!ticketName.trim()}
            isLoading={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TicketForm;
