import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Storage as MemoryIcon,
  Memory as CpuIcon,
  GraphicEq as GpuIcon,
} from "@mui/icons-material";

import { ResourceType } from "@/types/enum";

type ResourceCardEnhancedProps = {
  type: ResourceType;
  used: number;
  total?: number;
  unit?: string;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
};

const getResourceConfig = (type: ResourceType) => {
  switch (type) {
    case ResourceType.cpu:
      return {
        label: "CPU",
        icon: <CpuIcon className="!w-6 !h-6" />,
        color: "primary" as const,
        defaultUnit: "Cores",
      };
    case ResourceType.gpu:
      return {
        label: "GPU",
        icon: <GpuIcon className="!w-6 !h-6" />,
        color: "secondary" as const,
        defaultUnit: "GiB",
      };
    case ResourceType.memory:
      return {
        label: "RAM",
        icon: <MemoryIcon className="!w-5 !h-5" />,
        color: "success" as const,
        defaultUnit: "GiB",
      };
    default:
      return {
        label: "Resource",
        icon: null,
        color: "default" as const,
        defaultUnit: "units",
      };
  }
};

const ResourceCardEnhanced = ({
  type,
  used,
  total,
  unit,
  size = "md",
}: ResourceCardEnhancedProps) => {
  const config = getResourceConfig(type);
  const displayUnit = unit || config.defaultUnit;

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <Card
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      shadow="none"
    >
      <CardBody className={`${sizeClasses[size]} px-4 space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className="font-medium text-sm">{config.label}</span>
          </div>
          <Chip color={config.color} size="lg" variant="flat">
            <span className="font-medium text-lg">{used}</span>{" "}
            <span className="font-medium text-xs">{displayUnit}</span>
            {/* {total && ` / ${total} ${displayUnit}`} */}
          </Chip>
        </div>

        {/* {showProgress && total && (
          <div className="space-y-1">
            <Progress
              className="w-full"
              color={config.color}
              size="sm"
              value={usagePercentage}
            />
            <div className="text-xs text-gray-500 text-right">
              {usagePercentage.toFixed(1)}% used
            </div>
          </div>
        )} */}
      </CardBody>
    </Card>
  );
};

export default ResourceCardEnhanced;
