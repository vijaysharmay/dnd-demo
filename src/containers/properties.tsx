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
import useElementStore from "@/store";
import { AttributePropertyConfig } from "@/types";
import { useState } from "react";

export default function Properties() {
  const { activeElementId, getElementById, updateElement } = useElementStore();
  const [inputFocusKey, setInputFocusKey] = useState("");
  if (!activeElementId) return;
  const activeElement = getElementById(activeElementId);
  if (!activeElement) return;
  const { attributes } = activeElement;

  const ElementProperty = ({
    property,
    propertyValue,
    propertyOptions,
  }: {
    property: string;
    propertyValue: string;
    propertyOptions: string[] | null;
  }) => {
    const handlePropertyOptionChange = (key: string, value: string) => {
      const { attributes } = activeElement;
      const updatedAttributes = { [key]: value, ...attributes };
      const updatedElement = { ...activeElement, updatedAttributes };
      updateElement(activeElement.id, updatedElement);
    };
    const handlePropertyChange = (key: string, value: string) => {
      setInputFocusKey(key);
      const { attributes } = activeElement;
      const attributePropertyObj = attributes[key];
      const updatedAttributeProperties = {
        ...attributePropertyObj,
        propertyValue: value,
      };
      const updatedAttributes = {
        ...attributes,
        [key]: updatedAttributeProperties,
      };
      const updatedElement = {
        ...activeElement,
        attributes: updatedAttributes,
      };
      updateElement(activeElement.id, updatedElement);
    };

    return (
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="w-36">
          <Label className="text-xs">{property}:</Label>
        </div>
        {propertyOptions ? (
          <Select
            value={propertyValue}
            onValueChange={(value) =>
              handlePropertyOptionChange(property, value)
            }
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
