import { Chip } from "@heroui/chip";

import { ResourceType } from "@/types/enum";

const getResourceLabel = (type: ResourceType) => {
  switch (type) {
    case ResourceType.cpu:
      return "CPU";
    case ResourceType.gpu:
      return "GPU";
    case ResourceType.memory:
      return "RAM";
    default:
      return "resource";
  }
};

const color = (type: ResourceType) => {
  switch (type) {
    case ResourceType.cpu:
      return "primary";
    case ResourceType.gpu:
      return "secondary";
    case ResourceType.memory:
      return "success";
    default:
      return "default";
  }
};

const ResourceChip = ({
  type,
  value = 0,
}: {
  type: ResourceType;
  value?: number;
}) => {
  return (
    <Chip
      className="flex items-center gap-1"
      color={color(type)}
      size="md"
      variant="flat"
    >
      <span className="flex items-center gap-1">
        <span className="">{getResourceLabel(type)}: </span>
        <span className="font-semibold">{value}</span>
      </span>
    </Chip>
  );
};

export default ResourceChip;
