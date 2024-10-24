import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useElementStore from "@/store";

export default function Properties() {
  const { activeElement } = useElementStore();
  if (!activeElement) return null;
  const { attributes } = activeElement;
  return (
    <>
      {activeElement && (
        <div className="p-2 flex flex-wrap gap-2">
          <div className="text-center w-full font-semibold text-muted-foreground">
            Properties
          </div>
          {Object.keys(attributes).map((key: string) => {
            return (
              <ElementProperty property={key} propertyValue={attributes[key]} />
            );
          })}
        </div>
      )}
    </>
  );
}

function ElementProperty({ property, propertyValue }) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="w-36">
        <Label>{property}:</Label>
      </div>
      <Input type="text" value={propertyValue} />
    </div>
  );
}
