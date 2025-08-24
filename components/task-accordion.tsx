"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Divider } from "@heroui/divider";
import {
  ConfirmationNumberOutlined,
  EditCalendarOutlined,
  Assignment as TaskIcon,
} from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceSummary from "./resource-summary";
import SubTicketEnhanced from "./sub-ticket-enhanced";
import StopButtonClient from "./stop-button-client";

import { Status } from "@/types/enum";
import { formatDate, getStatusIndicator } from "@/utils/helper";

type Ticket = {
  id: string;
  spec: {
    resource: { name: string; quantity: string }[];
  }[];
};

type AccordionProps = {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  status?: Status;
  tickets?: Ticket[];
};

const TaskAccordion = ({
  id = "Default ID",
  title = "Default Title",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  createdAt = "Default Created At",
  status = Status.active,
  tickets = [],
}: AccordionProps) => {
  const ticketCount = tickets.length;
  const statusIndicator = getStatusIndicator(status);
  const formattedDate = formatDate(createdAt);

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
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
        subtitle={
          <div className="flex justify-between items-center mt-3 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <TaskIcon className="!w-4 !h-4" />
                <span className="font-medium">ID:</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <EditCalendarOutlined className="!w-4 !h-4" />
                <span className="text-xs">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <ConfirmationNumberOutlined className="!w-4 !h-4" />
                <span className="text-xs">
                  {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        }
        textValue="Task Item"
        title={
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${statusIndicator.bgColor}`}>
                <statusIndicator.icon
                  className={`!w-5 !h-5 ${statusIndicator.color}`}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            </div>
            <StatusChip status={status} />
          </div>
        }
      >
        <div className="p-4 space-y-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          {/* Resource Summary Section */}
          <div className="space-y-3">
            <ResourceSummary
              resourceLimits={{
                cpu: 100, // You can make this dynamic based on your requirements
                gpu: 10,
                memory: 1000,
              }}
              showBreakdown={false}
              ticketCount={ticketCount}
              totalResources={totalResource}
            />
          </div>

          {/* Divider */}
          <Divider className="my-4" />

          {/* Tickets Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ConfirmationNumberOutlined className="!w-4 !h-4" />
                Tickets ({ticketCount})
              </h4>
              {ticketCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing all tickets
                </span>
              )}
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
                    layout="horizontal"
                    name={ticket.id}
                    resources={ticket.spec[0]?.resource.reduce(
                      (acc, res) => {
                        acc[res.name] = Number(res.quantity);

                        return acc;
                      },
                      {} as Record<string, number>,
                    )}
                    showProgress={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {status === Status.active && (
            <>
              <Divider className="my-4" />
              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Task is currently running
                </div>
                <StopButtonClient taskId={title} />
              </div>
            </>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default TaskAccordion;
