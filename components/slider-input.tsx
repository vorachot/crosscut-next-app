import { Slider } from "@heroui/slider";
import { useState } from "react";

type SliderInputProps = {
  label?: string;
  maxValue?: number;
};

const SliderInput = ({
  label = "default",
  maxValue = 10,
}: SliderInputProps) => {
  const [value, setValue] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  const handleChange = (value: any) => {
    if (isNaN(Number(value))) return;

    setValue(value);
    setInputValue(value.toString());
  };

  return (
    <Slider
      classNames={{
        base: "max-w-md",
        label: "text-sm font-medium text-gray-700 dark:text-gray-300",
      }}
      color="primary"
      label={label}
      maxValue={maxValue}
      minValue={0}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderValue={({ children, ...props }) => (
        <output {...props}>
          <input
            aria-label={`${label} value`}
            className="px-1 py-0.5 w-12 text-right text-small text-default-700 font-medium bg-default-100 outline-hidden transition-colors rounded-small border-medium border-transparent hover:border-primary focus:border-primary"
            type="text"
            value={inputValue}
            onBlur={() => {
              const numValue = Number(inputValue);

              if (!isNaN(numValue)) {
                const clamped = Math.max(0, Math.min(numValue, maxValue));

                setValue(clamped);
                setInputValue(clamped.toString());
              }
            }}
            onChange={(e) => {
              const v = e.target.value;

              if (v === "" || !isNaN(Number(v))) {
                setInputValue(v);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();

                const numValue = Number(inputValue);

                if (!isNaN(numValue)) {
                  const clampedValue = Math.max(
                    0,
                    Math.min(numValue, maxValue),
                  );

                  setValue(clampedValue);
                  setInputValue(clampedValue.toString());
                }
              }
            }}
          />
        </output>
      )}
      size="sm"
      step={1}
      value={value}
      onChange={handleChange}
    />
  );
};

export default SliderInput;
