import {
  Assignment as TaskIcon,
  PlayArrow as RunningIcon,
  CheckCircle as CompletedIcon,
  Cancel as StoppedIcon,
} from "@mui/icons-material";

import { Status } from "@/types/enum";

export function getStatusLabel(status: string) {
  return Status[status as keyof typeof Status] ?? status;
}
export const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.ready:
      return "success";
    case Status.active:
      return "primary";
    case Status.succeeded:
    case Status.cancelled:
      return "default";
    case Status.inactive:
      return "danger";
    default:
      return "default";
  }
};

export const getStatusIndicator = (status: Status) => {
  switch (status) {
    case Status.active:
      return {
        icon: RunningIcon,
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      };
    case Status.succeeded:
      return {
        icon: CompletedIcon,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      };
    case Status.inactive:
      return {
        icon: StoppedIcon,
        color: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
      };
    default:
      return {
        icon: TaskIcon,
        color: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
      };
  }
};

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const getDisplayName = (segment: string, breadcrumbData: any) => {
  // Check if this segment is an ID that we have a name for
  return breadcrumbData[segment] || decodeURIComponent(segment);
};
