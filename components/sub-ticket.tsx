import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";

type SubTicketProps = {
  name?: string;
  resources?: Record<string, number>;
};

const SubTicket = ({ name = "default-name", resources }: SubTicketProps) => {
  return (
    <Card
      className="flex py-2 px-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
      radius="md"
      shadow="none"
    >
      <div className="flex gap-4 items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {name}
        </div>
        <div className="flex flex-row gap-2 mt-1">
          <Chip size="sm">
            <span className="text-gray-700 dark:text-gray-300">
              CPU: {resources?.cpu || 0}
            </span>
          </Chip>
          <Chip size="sm">
            <span className="text-gray-700 dark:text-gray-300">
              GPU: {resources?.gpu || 0}
            </span>
          </Chip>
          <Chip size="sm">
            <span className="text-gray-700 dark:text-gray-300">
              MEM: {resources?.memory || 0}
            </span>
          </Chip>
        </div>
      </div>
    </Card>
  );
};

export default SubTicket;
