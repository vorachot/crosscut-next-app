import { Chip } from "@heroui/chip";

import { ResourceType } from "@/types/enum";

const getResourceLabel = (type: ResourceType) => {
  switch (type) {
    case ResourceType.cpu:
      return "CPU";
    case ResourceType.gpu:
      return "GPU";
    case ResourceType.memory:
      return "MEM";
    default:
      return "resource";
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
    <Chip className="flex items-center gap-1">
      <span className="flex items-center gap-1">
        <span className="">{getResourceLabel(type)}: </span>
        <span className="font-semibold">{value}</span>
      </span>
    </Chip>
  );
};

export default ResourceChip;
