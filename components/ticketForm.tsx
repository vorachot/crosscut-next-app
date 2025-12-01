"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import toast, { Toaster } from "react-hot-toast";

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
  const [hours, setHours] = useState<number>(1);
  const [minutes, setMinutes] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (resource_id: string, value: number) => {
    setResourceValues((prev) => ({
      ...prev,
      [resource_id]: value,
    }));
  };
  const getTotalDurationMinutes = () => {
    return hours * 60 + minutes;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGpuRamRequirement(true)) {
      return;
    }
    if (!validateResourceSelection(true)) {
      return;
    }
    if (getTotalDurationMinutes() <= 60) {
      toast.error("Duration must be greater than 1 hour", {
        duration: 4000,
        icon: "⚠️",
      });

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
      duration: getTotalDurationMinutes() * 60, // Convert to seconds
    };

    try {
      await createTicketToCH(requestTicketPayload);
      toast.success("Ticket created successfully!");
      if (setOnClose) {
        setOnClose();
      }
      await mutate(["tickets", namespace_id], undefined, {
        revalidate: true,
      });
      await mutate(["quota-usage", namespace_id, quota_id], undefined, {
        revalidate: true,
      });
    } catch (error) {
      toast.error("Failed to create ticket. Please try again: " + error);
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
  const validateGpuRamRequirement = (showToast = false) => {
    const gpuValue = getResourceValueByType("GPU");
    const ramValue = getResourceValueByType("RAM");

    if (gpuValue > 0 && ramValue < 2) {
      if (showToast) {
        toast.error("Increase your RAM allocation to at least 2 GB", {
          duration: 4000,
          icon: "⚠️",
        });
      }

      return false;
    }

    return true;
  };
  const validateResourceSelection = (showToast = false) => {
    const cpuValue = getResourceValueByType("CPU");
    const gpuValue = getResourceValueByType("GPU");
    const ramValue = getResourceValueByType("RAM");

    if (cpuValue <= 0 || gpuValue <= 0 || ramValue <= 0) {
      if (showToast) {
        toast.error(
          "Resource values cannot be zero. Please adjust your selections.",
          {
            duration: 4000,
            icon: "⚠️",
          },
        );
      }

      return false;
    }

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
      validateGpuRamRequirement(false);
    }
  }, [resourceValues, resourceDetails]);

  const isFormValid = () => {
    return (
      ticketName.trim() &&
      getTotalResourcesSelected() > 0 &&
      getTotalDurationMinutes() > 0
    );
  };

  return (
    <div className="px-6">
      <Toaster />
      <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* Ticket Details Section */}
        <div className="space-y-4 w-full">
          <Input
            isRequired
            className="w-full"
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
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Duration <span className="text-red-500">*</span>
            </div>
            <div className="flex gap-3 items-center w-full">
              <Input
                className="w-full"
                classNames={{
                  input: "text-gray-700 dark:text-gray-200",
                  label: "text-gray-600 dark:text-gray-300 font-medium",
                }}
                label="Hours"
                labelPlacement="outside"
                max="23"
                min="1"
                type="number"
                value={hours.toString()}
                variant="bordered"
                onValueChange={(value) => setHours(parseInt(value) || 0)}
              />
              <Input
                className="w-full"
                classNames={{
                  input: "text-gray-700 dark:text-gray-200",
                  label: "text-gray-600 dark:text-gray-300 font-medium",
                }}
                label="Minutes"
                labelPlacement="outside"
                max="59"
                min="0"
                type="number"
                value={minutes.toString()}
                variant="bordered"
                onValueChange={(value) => setMinutes(parseInt(value) || 0)}
              />
              {/* <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Total: {getTotalDurationMinutes()} min
              </div> */}
            </div>
          </div>
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
