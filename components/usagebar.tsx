import { Progress } from "@heroui/progress";

type UsageBarProps = {
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
    case "MEM":
    case "Memory":
      return "success";
    default:
      return "primary";
  }
};

const UsageBar = ({
  label = "Default Label",
  value = 0,
  maxValue = 100,
}: UsageBarProps) => {
  return (
    <Progress
      color={color(label)}
      label={label}
      maxValue={maxValue}
      showValueLabel={true}
      size="sm"
      value={value}
      valueLabel={`${value} / ${maxValue}`}
    />
  );
};

export default UsageBar;
