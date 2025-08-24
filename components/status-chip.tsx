import { Chip } from "@heroui/chip";

import { Status } from "@/types/enum";

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ready:
      return "success";
    case Status.active:
      return "primary";
    case Status.succeeded:
      return "default";
    case Status.inactive:
      return "danger";
    default:
      return "default";
  }
};

const StatusChip = ({ status }: { status: string }) => {
  return (
    <Chip color={getStatusColor(status as Status)} variant="flat">
      <span className="flex items-center gap-1">
        <span className="text-xs font-semibold">{status}</span>
      </span>
    </Chip>
  );
};

export default StatusChip;
