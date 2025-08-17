"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ConfirmationNumberOutlined,
  EditCalendarOutlined,
} from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";
import SubTicket from "./sub-ticket";
import StopButtonClient from "./stop-button-client";

import { ResourceType, Status } from "@/types/enum";

type Ticket = {
  id: string;
  spec: {
    resource: { name: string; quantity: string }[];
  }[];
};

type AccordionProps = {
  title?: string;
  createdAt?: string;
  status?: Status;
  tickets?: Ticket[];
};

const TaskAccordion = ({
  title = "Default Title",
  createdAt = "Default Created At",
  status = Status.active,
  tickets = [],
}: AccordionProps) => {
  const ticketCount = tickets.length;
  const totalResource = tickets.reduce(
    (acc, ticket) => {
      ticket.spec.forEach((spec) => {
        spec.resource.forEach((res) => {
          const qty = Number(res.quantity);

          acc[res.name] = (acc[res.name] || 0) + qty;
        });
      });

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Accordion className="w-full" variant="splitted">
      <AccordionItem
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
        subtitle={
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <EditCalendarOutlined className="!w-4 !h-4" />
                <span>Created: {createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <ConfirmationNumberOutlined className="!w-4 !h-4" />
                <span>Tickets: {ticketCount}</span>
              </div>
            </div>
          </div>
        }
        textValue="Task Item"
        title={
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="font-semibold text-lg text-gray-800 dark:text-white">
                {title}
              </div>
              <StatusChip status={status} />
            </div>
          </div>
        }
      >
        <div className="p-3 space-y-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Resources Usage:
              </h4>
            </div>
            <div className="flex gap-3">
              <ResourceChip type={ResourceType.cpu} value={totalResource.cpu} />
              <ResourceChip type={ResourceType.gpu} value={totalResource.gpu} />
              <ResourceChip
                type={ResourceType.memory}
                value={totalResource.memory}
              />
            </div>

            {/* <div className="flex gap-2">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Description:
              </h4>
              <p className=" text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {defaultContent}
              </p>
            </div> */}
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Tickets:
            </h4>
            <div className="flex flex-col gap-2 mt-2">
              {tickets?.map((ticket, index) => (
                <SubTicket
                  key={index}
                  name={ticket.id}
                  resources={ticket.spec[0].resource.reduce(
                    (acc, res) => {
                      acc[res.name] = Number(res.quantity);

                      return acc;
                    },
                    {} as Record<string, number>,
                  )}
                />
              ))}
            </div>
          </div>
          {status === Status.active && (
            <div className="pt-4 pr-2 flex justify-end items-center">
              <StopButtonClient taskId={title} />
            </div>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default TaskAccordion;
