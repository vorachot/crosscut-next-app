import { Chip } from "@heroui/chip";

import { Status } from "@/types/enum";
import { getStatusColor } from "@/utils/helper";

const StatusChip = ({ status }: { status: string }) => {
  return (
    <Chip
      className="px-2 border-none text-default-600"
      color={getStatusColor(status as Status)}
      variant="dot"
    >
      <span className="flex items-center">
        <span className="text-xs font-semibold">{status}</span>
      </span>
    </Chip>
  );
};

export default StatusChip;
