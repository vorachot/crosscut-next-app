"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  ConfirmationNumberOutlined,
  EditCalendarOutlined,
} from "@mui/icons-material";
import { Chip } from "@heroui/chip";
import { Toaster } from "react-hot-toast";

import StatusChip from "./status-chip";
import StopButtonClient from "./stop-button-client";
import ResourceSummary from "./resource-summary";
import SubTicketEnhanced from "./sub-ticket-enhanced";

import { Status } from "@/types/enum";
import { formatDate, getStatusIndicator, getStatusLabel } from "@/utils/helper";
import { UserTicketResponse } from "@/types/ticket";

type AccordionProps = {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  status?: Status;
  tickets?: UserTicketResponse[];
};

const TaskAccordion = ({
  id,
  title,
  createdAt,
  status = Status.pending,
  tickets,
}: AccordionProps) => {
  const ticketCount = tickets!.length;
  const statusIndicator = getStatusIndicator(status);
  const formattedDate = formatDate(createdAt!);

  const totalResource = tickets!.reduce(
    (acc, ticket) => {
      ticket.ticket.spec.resource.forEach((res) => {
        if (acc[res.name]) {
          acc[res.name] += res.quantity;
        } else {
          acc[res.name] = res.quantity;
        }
      });

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <Toaster />
      <Accordion className="w-full" variant="splitted">
        <AccordionItem
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
          textValue="Task Item"
          title={
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full`}>
                  <statusIndicator.icon
                    className={`!w-5 !h-5 ${statusIndicator.color}`}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-md text-gray-900 dark:text-white">
                    {title || "Default Title"}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                    <div className="flex items-center gap-1">
                      <EditCalendarOutlined className="!w-3 !h-3" />
                      <span className="text-xs">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ConfirmationNumberOutlined className="!w-3 !h-3" />
                      <span className="text-xs">
                        {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <StatusChip status={getStatusLabel(status)} />
            </div>
          }
        >
          <div className="p-4 space-y-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            {/* Resource Summary Section */}
            <div className="space-y-3 px-5">
              <ResourceSummary
                resourceLimits={{
                  AMD: 100, // You can make this dynamic based on your requirements
                  A200: 10,
                  RAMMY: 1000,
                }}
                showBreakdown={false}
                ticketCount={ticketCount}
                totalResources={totalResource}
              />
            </div>
            {/* Tickets Section */}
            <div className="space-y-3 px-5">
              <div className="flex gap-3 items-center justify-start">
                <h4 className="text-xs px-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <ConfirmationNumberOutlined className="!w-4 !h-4" />
                  Tickets
                </h4>
                <Chip color="primary" size="sm" variant="flat">
                  {ticketCount} tickets
                </Chip>
              </div>

              {ticketCount === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <ConfirmationNumberOutlined className="!w-8 !h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tickets available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets?.map((ticket, index) => (
                    <SubTicketEnhanced
                      key={ticket.id || index}
                      name={ticket.name}
                      password={ticket.password}
                      resources={ticket.ticket.spec.resource}
                      taskStatus={status}
                      url={ticket.url}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {getStatusLabel(status) === Status.redeemed && (
              <>
                <div className="flex justify-end items-center pt-2 px-5">
                  <StopButtonClient taskId={id!} />
                </div>
              </>
            )}
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default TaskAccordion;
