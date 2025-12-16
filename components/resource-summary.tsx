import { Card, CardBody } from "@heroui/card";
import { BarChart as BarChartIcon } from "@mui/icons-material";

import ResourceCardEnhanced from "./resource-card-enhanced";

import { ResourceType } from "@/types/enum";

type ResourceSummaryProps = {
  totalResources: Record<string, number>;
  ticketCount: number;
  showBreakdown?: boolean;
  resourceLimits?: Record<string, number>;
};

const ResourceSummary = ({
  totalResources,
  ticketCount,
  showBreakdown = false,
  resourceLimits,
}: ResourceSummaryProps) => {
  const resourceTypes = [
    { type: ResourceType.cpu, key: "CPU", unit: "Cores" },
    { type: ResourceType.gpu, key: "GPU", unit: "GiB" },
    { type: ResourceType.memory, key: "RAM", unit: "GiB" },
  ];

  const hasAnyResources = resourceTypes.some(
    ({ key }) => (totalResources[key] || 0) > 0,
  );

  if (!hasAnyResources) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900 border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardBody className="py-6 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <BarChartIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No resources allocated</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* <div className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-500" />
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Resource Usage Summary
            </h4>
          </div>
        </div>
      </div> */}
      <div className="pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {resourceTypes.map(({ type, key, unit }) => (
            <ResourceCardEnhanced
              key={key}
              showProgress={!!resourceLimits?.[key]}
              size="md"
              total={resourceLimits?.[key]}
              type={type}
              unit={unit}
              used={totalResources[key] || 0}
            />
          ))}
        </div>

        {showBreakdown && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              {resourceTypes.map(({ key, unit }) => {
                const avgPerTicket =
                  ticketCount > 0
                    ? ((totalResources[key] || 0) / ticketCount).toFixed(1)
                    : "0";

                return (
                  <div key={key} className="text-center">
                    <div className="font-medium">{avgPerTicket}</div>
                    <div>avg {unit}/ticket</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSummary;
