import { Chip } from "@heroui/chip";

import { Status } from "@/types/enum";
import { getStatusColor } from "@/utils/helper";

const StatusChip = ({
  status,
  isTask = false,
}: {
  status: string;
  isTask?: boolean;
}) => {
  return (
    <>
      {isTask ? (
        <Chip
          className="min-w-[120px] px-2 text-default-600 text-center justify-center border border-gray-200 dark:border-gray-600"
          color={getStatusColor(status as Status)}
          variant="dot"
        >
          <span className="flex items-center justify-center">
            <span className="text-xs font-semibold">{status}</span>
          </span>
        </Chip>
      ) : (
        <Chip
          className="border-none"
          color={getStatusColor(status as Status)}
          variant="dot"
        >
          <span className="flex items-center">
            <span className="text-xs font-semibold">{status}</span>
          </span>
        </Chip>
      )}
    </>
  );
};

export default StatusChip;
