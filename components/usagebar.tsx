import { Progress } from "@heroui/progress";

type UsageBarProps = {
  label?: string;
  value?: number;
  maxValue?: number;
};

const UsageBar = ({
  label = "Default Label",
  value = 0,
  maxValue = 100,
}: UsageBarProps) => {
  return (
    <Progress
      color="primary"
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
