import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  EditCalendarOutlined,
  EventOutlined,
  FolderOpenOutlined,
} from "@mui/icons-material";

import { getDisplayName } from "@/utils/helper";
import { useBreadcrumb } from "@/context/BreadCrumbContext";

type InfoCardProps = {
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const InfoCard = ({ projectId, createdAt, updatedAt }: InfoCardProps) => {
  const { breadcrumbData } = useBreadcrumb();

  // Helper function to check if a value looks like a UUID
  const isUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return uuidRegex.test(str);
  };

  // Get display name and loading state
  const projectDisplayName = getDisplayName(projectId!, breadcrumbData);
  const isProjectLoading = Boolean(
    projectId &&
      isUUID(projectId) &&
      projectDisplayName === projectId &&
      !breadcrumbData?.[projectId],
  );

  const InfoItem = ({
    label,
    value,
    icon,
    isLoading,
  }: {
    label: string;
    value?: string;
    icon?: React.ReactNode;
    isLoading?: boolean;
  }) => (
    <div className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg p-3 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-1">
          {icon && (
            <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
              {icon}
            </span>
          )}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </span>
        </div>
      </div>
      <div className="ml-6">
        {isLoading ? (
          <span className="inline-block w-32 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
        ) : value ? (
          <span className="text-base font-medium text-gray-900 dark:text-gray-100 break-words">
            {value}
          </span>
        ) : (
          <Chip className="text-xs" color="default" size="sm" variant="flat">
            Not specified
          </Chip>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-gray-200 dark:ring-gray-700">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current system details
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-6 pb-6 pt-2">
        <div className="space-y-1">
          <InfoItem
            icon={<FolderOpenOutlined className="!w-4 !h-4" />}
            isLoading={isProjectLoading}
            label="Project Name"
            value={projectDisplayName}
          />

          <InfoItem
            icon={<EventOutlined className="!w-4 !h-4" />}
            label="Created"
            value={createdAt}
          />

          <InfoItem
            icon={<EditCalendarOutlined className="!w-4 !h-4" />}
            label="Last Updated"
            value={updatedAt}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default InfoCard;
