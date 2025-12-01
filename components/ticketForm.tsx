"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

import SliderInput from "./slider-input";

import { RequestTicketPayload } from "@/types/payload";
import { Quota, ResourceUsage } from "@/types/resource";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";

type TicketFormProps = {
  namespace_id: string;
  quota_id: string;
  quota: Quota;
  usageQuota?: ResourceUsage[];
  createTicketToCH: (payload: RequestTicketPayload) => Promise<any>;
  setOnClose?: () => void;
};

const TicketForm = ({
  namespace_id,
  quota_id,
  quota,
  createTicketToCH,
  setOnClose,
  usageQuota,
}: TicketFormProps) => {
  const [resourceDetails, setResourceDetails] = useState<any[]>([]);
  const [resourceValues, setResourceValues] = useState<Record<string, number>>(
    {},
  );
  const [ticketName, setTicketName] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleValueChange = (resource_id: string, value: number) => {
    setResourceValues((prev) => ({
      ...prev,
      [resource_id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGpuRamRequirement()) {
      return;
    }
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
      duration: duration * 60,
    };

    try {
      await createTicketToCH(requestTicketPayload);
      if (setOnClose) {
        setOnClose();
      }
      await mutate(["tickets", namespace_id], undefined, { revalidate: true });
      await mutate(["quota-usage", namespace_id, quota_id], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalResourcesSelected = () => {
    return Object.values(resourceValues).reduce((sum, val) => sum + val, 0);
  };

  const getAvailableQuantity = (
    resourceType: string,
    originalQuantity: number,
  ) => {
    if (!usageQuota) return originalQuantity;

    const usageData = usageQuota.find((u) => u.type === resourceType);

    if (!usageData) return originalQuantity;

    // Calculate available quantity: quota - usage
    const available = usageData.quota - usageData.usage;

    // Return the minimum of original quantity and available quantity
    return Math.min(originalQuantity, Math.max(0, available));
  };
  const validateGpuRamRequirement = () => {
    const gpuValue = getResourceValueByType("GPU");
    const ramValue = getResourceValueByType("RAM");

    if (gpuValue > 0 && ramValue < 2) {
      setValidationError(
        "Increase your RAM allocation to at least 2 GB when requesting GPU resources.",
      );

      return false;
    }

    setValidationError("");

    return true;
  };

  // Helper function to get resource value by type
  const getResourceValueByType = (resourceType: string) => {
    const resource = resourceDetails.find(
      (res) => res.detail?.resource?.resource_type?.name === resourceType,
    );

    if (!resource) return 0;

    return resourceValues[resource.resource_prop.resource_id] || 0;
  };

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
  useEffect(() => {
    if (resourceDetails.length > 0) {
      validateGpuRamRequirement();
    }
  }, [resourceValues, resourceDetails]);

  const isFormValid = () => {
    return (
      ticketName.trim() && getTotalResourcesSelected() > 0 && !validationError
    );
  };

  return (
    <div className="px-6">
      <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Ticket Details Section */}
        <div className="flex gap-4 items-center">
          <Input
            isRequired
            classNames={{
              input: "text-gray-700 dark:text-gray-200",
              label: "text-gray-600 dark:text-gray-300 font-medium",
            }}
            label="Ticket Name"
            labelPlacement="outside"
            placeholder="e.g., my-ticket"
            value={ticketName}
            variant="bordered"
            onValueChange={setTicketName}
          />
          <Input
            isRequired
            classNames={{
              input: "text-gray-700 dark:text-gray-200",
              label: "text-gray-600 dark:text-gray-300 font-medium",
            }}
            label="Duration (minutes)"
            labelPlacement="outside"
            max="180"
            min="1"
            type="number"
            value={duration.toString()}
            variant="bordered"
            onValueChange={(value) => setDuration(parseInt(value) || 0)}
          />
          {/* {getTotalResourcesSelected() > 0 && (
            <Chip color="primary" size="sm" variant="flat">
              {getTotalResourcesSelected()} resources selected
            </Chip>
          )} */}
        </div>
        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-r-lg">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-500 dark:text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="mt-1 text-xs text-red-600 dark:text-red-400">
              <strong>Tip:</strong> {validationError}
            </div>
          </div>
        )}
        {/* Resources Section */}
        <div className="w-full space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 dark:text-gray-300">
            Select Resources
          </h3>

          <div className="space-y-4">
            {resourceDetails.map((res) => {
              const availableQuantity = getAvailableQuantity(
                res.detail.resource.resource_type.name,
                res.quantity,
              );

              return (
                <Card
                  key={res.resource_prop.resource_id}
                  className="border border-gray-200 dark:border-gray-700"
                >
                  <CardBody className="p-4">
                    <SliderInput
                      label={`${res.detail.resource.resource_type.name} (${res.detail.resource.name})`}
                      maxValue={availableQuantity}
                      onValueChange={(val) =>
                        handleValueChange(res.resource_prop.resource_id, val)
                      }
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>Available: {availableQuantity}</span>
                      <span>
                        Selected:{" "}
                        {resourceValues[res.resource_prop.resource_id] || 0}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
        {/* Submit Section */}
        <div className="w-full flex justify-end gap-2">
          <Button
            className="w-24"
            color="primary"
            isDisabled={!isFormValid()}
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
