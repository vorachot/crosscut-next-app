import { Chip } from "@heroui/chip";
import { CircularProgress } from "@heroui/progress";

type UsageCircularProps = {
  label?: string;
  value?: number;
  maxValue?: number;
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
          svg: "w-48 h-48",
          // indicator: "stroke-white",
          // track: "stroke-white/10",
          // value: "text-3xl font-semibold text-white",
        }}
        color="primary"
        maxValue={maxValue}
        showValueLabel={true}
        strokeWidth={2}
        value={value}
        valueLabel={
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
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
