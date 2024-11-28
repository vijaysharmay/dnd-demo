import { ComponentElementInstance } from "@/types";
import { TextBlockPropsSchema } from "@/types/properties";

export const TextBlockDesignerComponent: React.FC<{
  elementInstance: ComponentElementInstance;
}> = ({ elementInstance }) => {
  const { props } = elementInstance;
  const {
    textBlockId,
    textBlockText,
    textBlockType,
    textBlockStyle,
    textBlockOrientation,
  } = props as TextBlockPropsSchema;

  // Map textBlock types to Tailwind classes
  const textBlockTypeClasses: Record<string, string> = {
    H1: "text-4xl font-bold",
    H2: "text-3xl font-semibold",
    H3: "text-2xl font-medium",
    H4: "text-xl font-medium",
    H5: "text-lg font-medium",
    H6: "text-base font-medium",
    Paragraph: "text-base font-normal",
  };

  // Orientation class mapping
  const orientationClass = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  }[textBlockOrientation];

  // Style class mapping
  const styleClass = {
    normal: "font-normal",
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  }[textBlockStyle];

  // Combine all classes
  const combinedClasses = `${textBlockTypeClasses[textBlockType]} ${orientationClass} ${styleClass}`;

  return (
    <div className="place-content-center w-full h-fit">
      <div id={textBlockId} className={`text-inherit ${combinedClasses}`}>
        {textBlockText}
      </div>
    </div>
  );
};

export const TextBlockDragOverlayComponent = () => {
  return (
    <div className="p-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
      Dragging TextBlock Component...
    </div>
  );
};
