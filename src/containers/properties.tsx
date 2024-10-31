import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { libraryElements } from "@/elements";
import useElementStore from "@/store/element-store";
import { ComponentElementInstance } from "@/types";
import { drop, dropRight, fill } from "lodash";
import { useState } from "react";

const ElementProperty = ({
  property,
  propertyValue,
  propertyOptions,
}: {
  property: string;
  propertyValue: string;
  propertyOptions: string[] | null;
}) => {
  const {
    activeElement,
    updateElement,
    addElement,
    getElementIndexById,
    setActiveElement,
  } = useElementStore();
  const [inputFocusKey, setInputFocusKey] = useState("");
  const handlePropertyChange = (key: string, value: string) => {
    if (activeElement) {
      setInputFocusKey(key);
      const { attributes } = activeElement as ComponentElementInstance;
      const attributePropertyObj = attributes[key];

      const updatedAttributeProperties = {
        ...attributePropertyObj,
        propertyValue: value,
      };
      const updatedAttributes = {
        ...attributes,
        [key]: updatedAttributeProperties,
      };
      const updatedElement: ComponentElementInstance = {
        ...activeElement,
        attributes: updatedAttributes,
      };

      if (updatedElement.children) {
        const childCount = updatedElement.children.length;

        if (key === "columns") {
          if (childCount > parseInt(value)) {
            const updatedElementIndex = getElementIndexById(activeElement.id);

            drop(updatedElement.children, parseInt(value)).forEach((child) => {
              if (child) {
                addElement(
                  updatedElementIndex + 1,
                  child as ComponentElementInstance
                );
              }
            });

            const childCountDiff = childCount - parseInt(value);
            updatedElement.children = dropRight(
              updatedElement.children,
              childCountDiff
            );
          } else {
            const childCountDiff = parseInt(value) - childCount;

            updatedElement.children = [
              ...updatedElement.children,
              ...fill(Array(childCountDiff), undefined),
            ];
          }
        }
      }

      updateElement(activeElement.id, updatedElement);
      setActiveElement(updatedElement);
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="w-36">
        <Label className="text-xs">{property}:</Label>
      </div>
      {propertyOptions ? (
        <Select
          value={propertyValue}
          onValueChange={(value) => handlePropertyChange(property, value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {propertyOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Input
          key={property}
          className="h-7"
          type="text"
          value={propertyValue}
          autoFocus={inputFocusKey === property}
          onChange={(e) => handlePropertyChange(property, e.target.value)}
        />
      )}
    </div>
  );
};

export default function Properties() {
  const { activeElement } = useElementStore();
  if (activeElement === null) return;
  const { type } = activeElement as ComponentElementInstance;
  const PropertiesComponent = libraryElements[type].propertiesComponent;

  return (
    <>
      {activeElement && <PropertiesComponent elementInstance={activeElement} />}
    </>
  );
}
