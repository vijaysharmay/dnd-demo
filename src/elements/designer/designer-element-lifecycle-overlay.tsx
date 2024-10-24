import { cn } from "@/lib/utils";
import useElementStore from "@/store";
import { EditIcon, Trash } from "lucide-react";
import React, { useState } from "react";

export default function DesignerElementLifeCycleOverlay({
  forElement,
  children,
}: {
  forElement: string;
  children: React.ReactElement;
}) {
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const { removeElement, setActiveElement } = useElementStore();

  const handleDelete = () => {
    removeElement(forElement);
  };

  const handleEdit = () => {
    setActiveElement(forElement);
  };

  return (
    <div
      onMouseEnter={() => setIsHoveredOn(true)}
      onMouseLeave={() => setIsHoveredOn(false)}
      className="grid w-full items-center gap-1.5"
    >
      {isHoveredOn && (
        <div className="flex flex-row">
          <EditIcon onClick={handleEdit} />
          <Trash onClick={handleDelete} />
        </div>
      )}
      <div className={cn("p-2 rounded", isHoveredOn ? "bg-gray-100" : "")}>
        {children}
      </div>
    </div>
  );
}
