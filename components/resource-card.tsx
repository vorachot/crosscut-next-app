import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import UsageCircular from "./usagecircular";

const ResourceCard = ({}) => {
  return (
    <Card className="p-2 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader className="text-[22px] font-medium text-gray-700 dark:text-gray-300">
        Resource Usage
      </CardHeader>
      <Divider className="my-2" />
      <CardBody className="flex flex-row justify-around">
        <UsageCircular label="CPU" maxValue={12} value={6} />
        <UsageCircular label="GPU" maxValue={12} value={6} />
        <UsageCircular label="Memory" maxValue={24} value={14} />
      </CardBody>
    </Card>
  );
};

export default ResourceCard;
