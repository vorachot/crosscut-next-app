import { Card, CardFooter, CardHeader } from "@heroui/card";
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
};

const ProjectCard = ({
  id = "default-id",
  title = "Default Title",
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
    <Link
      aria-label={`View project ${title} details`}
      className="no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      href={`/projects/${id}`}
    >
      <Card
        aria-label={`Project card for ${title}`}
        className="w-[300px] px-4 py-6 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 ease-in-out 
          hover:shadow-xl hover:scale-[1.02]"
        role="article"
      >
        <CardHeader className="flex gap-3 py-0 mb-2 items-start">
          <div className="flex-shrink-0">
            <Folder
              aria-hidden="true"
              className="!w-8 !h-8 text-gray-700 dark:text-gray-300"
            />
          </div>
          <p
            className="text-[22px] font-medium truncate flex-1"
            title={title} // Show full title on hover
          >
            {title}
          </p>
        </CardHeader>
        <Divider />
        <CardFooter className="flex flex-col gap-2">
          {usageData.length > 0 ? (
            usageData.map((item, index) => (
              <UsageBar
                key={`${item.type_id}-${index}`} // More unique key
                label={item.type}
                maxValue={item.quota}
                value={item.usage}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No usage data available
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
