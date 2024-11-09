import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsSchema, VariantsSchema } from "@/types/properties";
import { Info } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface InputFormFieldProps {
  name: string;
  tooltip: string;
  field: ControllerRenderProps<PropsSchema>;
}

interface SelectFormFieldProps {
  name: string;
  tooltip: string;
  variants: VariantsSchema;
  field: ControllerRenderProps<PropsSchema>;
}

export const InputFormField = ({
  name,
  tooltip,
  field,
}: InputFormFieldProps) => {
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
      <FormControl>
        <Input {...field} className="text-md justify-center" />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export const SelectFormField = ({
  name,
  tooltip,
  variants,
  field,
}: SelectFormFieldProps) => {
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
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a variant" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {variants.map((variant: string) => {
            return (
              <SelectItem key={variant} value={variant}>
                {variant}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
