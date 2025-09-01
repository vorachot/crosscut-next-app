import { Card, CardBody, CardHeader } from "@heroui/card";

import UsageCircular from "./usagecircular";

const ResourceCard = ({}) => {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-gray-200 dark:ring-gray-700">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Resource Usage
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current system utilization
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          <div className="group hover:scale-105 transition-transform duration-200">
            <UsageCircular label="CPU" maxValue={12} value={6} />
          </div>
          <div className="group hover:scale-105 transition-transform duration-200">
            <UsageCircular label="GPU" maxValue={12} value={6} />
          </div>
          <div className="group hover:scale-105 transition-transform duration-200">
            <UsageCircular label="Memory" maxValue={24} value={14} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ResourceCard;
