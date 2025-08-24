import { Card, CardBody } from "@heroui/card";

const TaskAccordionSkeleton = () => {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between py-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Metadata Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Resource Summary Section */}
        <div className="space-y-4 mb-6">
          <div className="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Tickets Section */}
        <div className="space-y-3">
          <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskAccordionSkeleton;
