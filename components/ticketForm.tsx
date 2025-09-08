"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import SliderInput from "./slider-input";

import { RequestTicketPayload } from "@/types/payload";
import { getResourceDetailByResourceIdFromCH } from "@/api/namespace";
import { Quota } from "@/types/resource";

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
  // เก็บค่าที่ user เลือก { resource_id: quantity }
  const [resourceDetails, setResourceDetails] = useState<any[]>([]);
  const [resourceValues, setResourceValues] = useState<Record<string, number>>(
    {},
  );

  // เมื่อ slider เปลี่ยนค่า
  const handleValueChange = (resource_id: string, value: number) => {
    setResourceValues((prev) => ({
      ...prev,
      [resource_id]: value,
    }));
  };

  // กด submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestTicketPayload: RequestTicketPayload = {
      name: "default-ticket",
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
    } catch {}
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!quota) return;

      const details = await Promise.all(
        quota.resources.map((res) =>
          getResourceDetailByResourceIdFromCH(res.resource_prop.resource_id),
        ),
      );

      // รวม quota + detail เข้าด้วยกัน
      const merged = quota.resources.map((res, i) => ({
        ...res,
        detail: details[i],
      }));

      setResourceDetails(merged);
    };

    fetchDetails();
  }, [quota]);

  return (
    <Form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
      {resourceDetails.map((res) => (
        <SliderInput
          key={res.resource_prop.resource_id}
          label={`${res.detail.resource_type.name} (${res.detail.name})`}
          maxValue={res.quantity}
          onValueChange={(val) =>
            handleValueChange(res.resource_prop.resource_id, val)
          }
        />
      ))}

      <Button
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        type="submit"
      >
        Submit Request
      </Button>
    </Form>
  );
};

export default TicketForm;
