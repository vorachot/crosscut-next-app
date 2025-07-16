"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  ConfirmationNumberOutlined,
  EditCalendarOutlined,
  Stop,
} from "@mui/icons-material";

type AccordionProps = {
  title?: string;
  subtitle?: string;
};

const AccordionComponent = ({
  title = "Default Title",
  subtitle = "20 Jan 2023",
}: AccordionProps) => {
  const defaultContent =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae sunt voluptatem officiis nemo.";

  return (
    <Accordion className="w-full" variant="splitted">
      <AccordionItem
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
        subtitle={
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <EditCalendarOutlined className="!w-4 !h-4" />
                <span>Created: {subtitle}</span>
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
              <Chip className="ml-2" color="primary" variant="flat">
                RUNNING
              </Chip>
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
              <div className="text-gray-700 dark:text-gray-300">
                <Chip>CPU: 4</Chip>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <Chip>GPU: 1</Chip>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <Chip>MEM: 16</Chip>
              </div>
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
              <Card
                className="flex py-1 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                radius="sm"
                shadow="none"
              >
                <div className="flex gap-4 items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Ticket 1
                  </div>
                  <div className="flex flex-row gap-2 mt-1">
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        CPU: 2
                      </span>
                    </Chip>
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        GPU: 1
                      </span>
                    </Chip>
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        MEM: 8
                      </span>
                    </Chip>
                  </div>
                </div>
              </Card>
              <Card
                className="flex py-1 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                radius="sm"
                shadow="none"
              >
                <div className="flex gap-4 items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Ticket 2
                  </div>
                  <div className="flex flex-row gap-2 mt-1">
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        CPU: 2
                      </span>
                    </Chip>
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        GPU: 0
                      </span>
                    </Chip>
                    <Chip size="sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        MEM: 8
                      </span>
                    </Chip>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="pt-6 flex justify-end items-center">
            <Button aria-label="Stop" color="danger" size="sm" variant="flat">
              <div className="flex items-center gap-1">
                <Stop className="!w-5 !h-5" name="stop" />
                <span className="text-sm">Stop</span>
              </div>
            </Button>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionComponent;
