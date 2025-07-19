"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import {
  ConfirmationNumberOutlined,
  EditCalendarOutlined,
  Stop,
} from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";
import SubTicket from "./sub-ticket";

import { ResourceType, Status } from "@/types/enum";

type AccordionProps = {
  title?: string;
  createdAt?: string;
  status?: Status;
};

const TaskAccordion = ({
  title = "Default Title",
  createdAt = "20 Jan 2023",
  status = Status.running,
}: AccordionProps) => {
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
                <span>Tickets: 3</span>
              </div>
            </div>
          </div>
        }
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
              <ResourceChip type={ResourceType.cpu} value={4} />
              <ResourceChip type={ResourceType.gpu} value={1} />
              <ResourceChip type={ResourceType.memory} value={16} />
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
              <SubTicket
                name="Ticket 1"
                resources={{ cpu: 2, gpu: 1, memory: 8 }}
              />
              <SubTicket
                name="Ticket 2"
                resources={{ cpu: 2, gpu: 0, memory: 8 }}
              />
              <SubTicket
                name="Ticket 3"
                resources={{ cpu: 0, gpu: 0, memory: 0 }}
              />
            </div>
          </div>
          {status === Status.running && (
            <div className="pt-4 pr-2 flex justify-end items-center">
              <Button aria-label="Stop" color="danger" size="sm" variant="flat">
                <div className="flex items-center gap-1">
                  <Stop className="!w-5 !h-5" name="stop" />
                  <span className="text-sm">Stop</span>
                </div>
              </Button>
            </div>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default TaskAccordion;
