import React, { act, useState } from "react";
export default function SliderButton({
  defaultSliderColor,
  activeSliderColor,
  shadowColor,
  activeNotchColor,
  inActiveNotchColor,
  shadow,
  inline = false,
  styleOptions,
  setValue,
  checkedValue
}) {
  const [checked, setChecked] = useState(checkedValue);
  return (
    <div className={`relative w-15  ml-auto h-7 mr-5 ${styleOptions}`}>
      <input
        type="checkbox"
        className="absolute  w-full top-[30%] p-2 opacity-0  z-3 cursor-pointer"
        checked={checked}
        onChange={() => {
          const newValue = !checked
          setChecked(newValue);
          setValue(newValue)
        }}
      />
      <span
        className={`absolute inset-0 ${shadowColor} ${shadow} ${
          checked ? activeSliderColor : defaultSliderColor
        } rounded-2xl w-15 `}
      >
        <div
          className={`
                    absolute top-0 left-0 
                    w-7 h-7 ${
                      checked ? activeNotchColor : inActiveNotchColor
                    } rounded-full 
                    transition-transform duration-300 ${
                      inline ? "inline-block" : ""
                    } ${checked ? "translate-x-[32px]" : ""}`}
        ></div>
      </span>
    </div>
  );
}
