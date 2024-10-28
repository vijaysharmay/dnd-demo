import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useElementStore from "@/store";
import { AttributePropertyConfig, ComponentElementInstance } from "@/types";
import { drop, dropRight } from "lodash";
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

        if (key === "columns" && childCount > parseInt(value)) {
          const updatedElementIndex = getElementIndexById(activeElement.id);

          drop(updatedElement.children, parseInt(value)).forEach((child) => {
            addElement(updatedElementIndex + 1, child);
          });

          updatedElement.children = dropRight(
            updatedElement.children,
            childCount - parseInt(value)
          );
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
  const { attributes } = activeElement as ComponentElementInstance;

  return (
    <>
      {activeElement && (
        <div className="p-2 flex flex-wrap gap-2">
          <div className="text-center w-full font-semibold text-muted-foreground">
            Properties
          </div>

          <div className="text-sm w-full text-zince-50 underline">
            Attributes
          </div>

          {Object.keys(attributes).map((key: string) => {
            const { propertyValue, showInProperties, options } = attributes[
              key
            ] as AttributePropertyConfig;

            return (
              showInProperties && (
                <ElementProperty
                  key={key}
                  property={key}
                  propertyValue={propertyValue}
                  propertyOptions={options}
                />
              )
            );
          })}

          <div className="text-sm w-full text-zince-50 underline pt-4">
            Events
          </div>
        </div>
      )}
    </>
  );
}
