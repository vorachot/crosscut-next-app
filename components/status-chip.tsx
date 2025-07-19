import { Chip } from "@heroui/chip";

import { Status } from "@/types/enum";

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.available:
      return "success";
    case Status.running:
      return "primary";
    case Status.succeeded:
      return "default";
    case Status.stopped:
      return "danger";
    default:
      return "default";
  }
};

const StatusChip = ({ status }: { status: Status }) => {
  return (
    <Chip color={getStatusColor(status)} variant="flat">
      <span className="flex items-center gap-1">
        <span className="font-semibold">{status}</span>
      </span>
    </Chip>
  );
};

export default StatusChip;
