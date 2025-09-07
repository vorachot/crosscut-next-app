import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

type SubTicketEnhancedProps = {
  name?: string;
  resources?: Record<string, number>;
  maxResources?: Record<string, number>;
  status?: string;
  showProgress?: boolean;
  layout?: "horizontal" | "vertical";
};

const getResourceColor = (resourceKey: string) => {
  switch (resourceKey.toLowerCase()) {
    case "cpu":
      return "primary";
    case "gpu":
      return "secondary";
    case "memory":
      return "success";
    default:
      return "default";
  }
};

const getResourceUnit = (resourceKey: string) => {
  switch (resourceKey.toLowerCase()) {
    case "cpu":
      return "cores";
    case "gpu":
      return "units";
    case "memory":
      return "GB";
    default:
      return "";
  }
};

const SubTicketEnhanced = ({
  name = "default-name",
  resources = {},
  maxResources,
  status,
  showProgress = false,
  layout = "horizontal",
}: SubTicketEnhancedProps) => {
  const resourceEntries = Object.entries(resources).filter(
    ([, value]) => value > 0,
  );

  if (layout === "vertical") {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {name}
            </div>
            {status && (
              <Chip size="sm" variant="dot">
                {status}
              </Chip>
            )}
          </div>

          <div className="space-y-2">
            {resourceEntries.map(([key, value]) => {
              const unit = getResourceUnit(key);
              const maxValue = maxResources?.[key];
              const percentage = maxValue ? (value / maxValue) * 100 : 0;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="uppercase font-medium">{key}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {value}
                      {unit}
                      {maxValue && ` / ${maxValue}${unit}`}
                    </span>
                  </div>
                  {showProgress && maxValue && (
                    <Progress
                      className="w-full"
                      color={getResourceColor(key) as any}
                      size="sm"
                      value={percentage}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="flex py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      radius="md"
      shadow="none"
    >
      <div className="flex gap-4 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {name}
          </div>
          {status && (
            <Chip size="sm" variant="dot">
              {status}
            </Chip>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {resourceEntries.map(([key, value]) => {
            return (
              <Chip
                key={key}
                color={getResourceColor(key) as any}
                size="sm"
                variant="flat"
              >
                <div className="flex items-center gap-1">
                  {/* {getResourceIcon(key)} */}
                  <span className="text-xs">
                    {key.toUpperCase()}: {value}
                  </span>
                </div>
              </Chip>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SubTicketEnhanced;
