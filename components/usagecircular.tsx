import { Chip } from "@heroui/chip";
import { CircularProgress } from "@heroui/progress";

type UsageCircularProps = {
  label?: string;
  value?: number;
  maxValue?: number;
};

const color = (label: string) => {
  switch (label) {
    case "CPU":
      return "primary";
    case "GPU":
      return "secondary";
    case "RAM":
      return "success";
    default:
      return "primary";
  }
};

const UsageCircular = ({
  value = 0,
  maxValue = 100,
  label = "Resource",
}: UsageCircularProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <CircularProgress
        aria-label={`Usage of ${label}`}
        classNames={{
          svg: "w-32 h-32",
        }}
        color={color(label)}
        maxValue={maxValue}
        showValueLabel={true}
        strokeWidth={2}
        value={value}
        valueLabel={
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-1">
              {value} / {maxValue}
            </span>
          </div>
        }
      />
      <Chip
        classNames={{
          base: "border-1 border-gray-300 dark:border-gray-600",
          content: "text-gray-700 dark:text-gray-200",
        }}
        size="lg"
        variant="bordered"
      >
        Remaining: {maxValue - value}
      </Chip>
    </div>
  );
};

export default UsageCircular;
