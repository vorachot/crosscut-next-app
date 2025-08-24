import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
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
        icon: <CpuIcon className="w-4 h-4" />,
        color: "primary" as const,
        defaultUnit: "cores",
      };
    case ResourceType.gpu:
      return {
        label: "GPU",
        icon: <GpuIcon className="w-4 h-4" />,
        color: "secondary" as const,
        defaultUnit: "units",
      };
    case ResourceType.memory:
      return {
        label: "Memory",
        icon: <MemoryIcon className="w-4 h-4" />,
        color: "success" as const,
        defaultUnit: "GB",
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
  showProgress = false,
  size = "md",
}: ResourceCardEnhancedProps) => {
  const config = getResourceConfig(type);
  const displayUnit = unit || config.defaultUnit;
  const usagePercentage = total ? (used / total) * 100 : 0;

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <Card
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
    >
      <CardBody className={`${sizeClasses[size]} space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <span className="font-medium text-sm">{config.label}</span>
          </div>
          <Chip color={config.color} size="sm" variant="flat">
            {used}
            {total && ` / ${total} ${displayUnit}`}
          </Chip>
        </div>

        {showProgress && total && (
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
        )}
      </CardBody>
    </Card>
  );
};

export default ResourceCardEnhanced;
