import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { EditCalendarOutlined, FolderOutlined } from "@mui/icons-material";
import Link from "next/link";

import UsageBar from "./usagebar";

type InfoCardProps = {
  id?: string;
  title?: string;
  createdDate: string;
};

const InfoCard = ({
  id = "default-id",
  title = "Default Title",
  createdDate = "Default Created Date",
}: InfoCardProps) => {
  return (
    <Link
      className="no-underline"
      href={`/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Card className="w-[300px] h-[285px] px-4 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer">
        <CardHeader className="flex gap-3 py-0 items-start">
          <div className="flex-shrink-0">
            <FolderOutlined className="!w-8 !h-8 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-[22px] font-medium">{title}</p>
        </CardHeader>
        <CardBody className="py-2 justify-end">
          <div className="flex items-center gap-1">
            {/* <EditCalendarOutlined className="!w-4 !h-4 text-gray-400" /> */}
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">Created: </span>
              <span className="font-medium">{createdDate}</span>
            </span>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-2">
          <UsageBar label="CPU" maxValue={2} value={1} />
          <UsageBar label="GPU" maxValue={4} value={2} />
          <UsageBar label="MEM" maxValue={4} value={1} />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default InfoCard;
