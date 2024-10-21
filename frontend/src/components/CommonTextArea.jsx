import { useLayoutEffect, useState } from "react";
import clsx from "clsx";

const CommonTextArea = ({
  inputRef,
  isFocused,
  onChangeInput,
  handleKeyDown,
  setIsFocused,
  textBoxValue,
  parentClassName,
  textAreaClassName,
  placeHolder
}) => {
  const [scrollBar, setScrollBar] = useState(false);  // Tracks if scroll is needed
  const maxHeight = 320;  // Maximum height for scrollbar

  // Adjust textarea height and scroll state
  useLayoutEffect(() => {
    const textArea = inputRef.current ?? document.getElementById("text_area_input");

    if (textArea) {
      textArea.style.height = "0px";  // Reset height
      const scrollHeight = textArea.scrollHeight;

      textArea.style.height = Math.min(scrollHeight, maxHeight) + "px";  // Adjust based on content

      // If the content is too large, show scrollbar
      if (scrollHeight >= maxHeight) {
        setScrollBar(true);
      } else {
        setScrollBar(false);
      }
    }
  }, [inputRef, textBoxValue]);  // Re-run when ref or text value changes

  return (
    <div
      className={clsx(
        "w-full", // Full width for alignment
        parentClassName,
        { "ask-question-input-focus": isFocused }  // Apply focus state
      )}
      onClick={() => setIsFocused(true)}  // Set focus state on click
    >
      <textarea
        id="text_area_input"
        ref={inputRef}
        className={clsx(
          "w-full max-h-80 rounded-lg p-3 text-sm font-light bg-primary-50 focus:outline-primary-50 focus:bg-bg-50",
          textAreaClassName,
          "textarea_design",
          {
            "overflow-y-auto": scrollBar  // Add scrollbar if needed
          },
          "resize-none"  // Disable resizing
        )}
        placeholder={placeHolder}
        value={textBoxValue}
        onClick={() => setIsFocused(true)}  // Set focus state on click
        onKeyDown={handleKeyDown}  // Handle key down events
        onChange={onChangeInput}  // Update value on change
      />
    </div>
  );
};

export default CommonTextArea;
