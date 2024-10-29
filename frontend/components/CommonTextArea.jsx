import { useLayoutEffect, useState } from "react";
import clsx from "clsx";

const CommonTextArea = ({
  inputRef,
  isFocused,
  onChangeInput,
  handleKeyDown,
  textBoxValue,
  textAreaClassName,
  placeHolder,
  disabled,
}) => {
  const [scrollBar, setScrollBar] = useState(false);
  const maxHeight = 320;

  useLayoutEffect(() => {
    const textArea = inputRef.current;

    if (textArea) {
      textArea.style.height = "0px";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = Math.min(scrollHeight, maxHeight) + "px";
      setScrollBar(scrollHeight >= maxHeight);
    }
  }, [inputRef, textBoxValue]);

  return (
    <div className={clsx("m-2 p-2", { "ask-question-input-focus": isFocused })}>
      <textarea
        ref={inputRef}
        className={clsx(
          "w-full max-h-80 rounded-lg p-3 text-xs md:text font-light bg-test-bg focus:outline-primary-50 focus:bg-bg-50",
          textAreaClassName,
          "textarea_design",
          { "overflow-y-auto": scrollBar },
          "resize-none"
        )}
        placeholder={placeHolder}
        value={textBoxValue}
        onKeyDown={handleKeyDown}
        onChange={onChangeInput}
        disabled={disabled}
      />
    </div>
  );
};

export default CommonTextArea;
