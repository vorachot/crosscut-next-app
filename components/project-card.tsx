import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Folder } from "@mui/icons-material";
import Link from "next/link";
import useSWR from "swr";

import UsageBar from "./usagebar";

import { getProjectUsageByProjectIdFromCH } from "@/api/project";
import Loading from "@/app/loading";
import { ResourceUsage } from "@/types/resource";

type ProjectCardProps = {
  id?: string;
  title?: string;
  createdDate: string;
};

const ProjectCard = ({
  id = "default-id",
  title = "Default Title",
  createdDate = "Default Created Date",
}: ProjectCardProps) => {
  const { data, error, isLoading } = useSWR(
    ["project-usage"],
    () => getProjectUsageByProjectIdFromCH(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading projects</div>;
  const usageData: ResourceUsage[] = data.projectUsage.usage || [];

  return (
    <Link className="no-underline" href={`/projects/${id}`}>
      <Card
        className="w-[300px] h-[285px] px-4 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer  transition-all duration-300 ease-in-out 
  hover:shadow-xl hover:scale-[1.02]"
      >
        <CardHeader className="flex gap-3 py-0 items-start">
          <div className="flex-shrink-0">
            <Folder className="!w-8 !h-8 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-[22px] font-medium">{title}</p>
        </CardHeader>
        <CardBody className="py-2 justify-end">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">Created: </span>
              <span className="font-medium">{createdDate}</span>
            </span>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-2">
          {usageData.map((item) => (
            <UsageBar
              key={item.type_id}
              label={item.type}
              maxValue={item.quota}
              value={item.usage}
            />
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
