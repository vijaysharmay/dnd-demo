import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface FormFieldProps {
  name: string;
  tooltip: string;
  children: React.ReactElement;
}

export const FormFieldRender = ({
  name,
  tooltip,
  children,
}: FormFieldProps) => {
  return (
    <FormItem>
      <FormLabel>
        <div className="flex flex-row">
          <div className="text-md">{name}</div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 ml-1 -mt-0.5" />
                </TooltipTrigger>
                <TooltipContent side="left">{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </FormLabel>
      <FormControl className="text-md justify-center">{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
};
