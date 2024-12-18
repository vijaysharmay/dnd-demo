import { JSONZType } from "./api/common";
import { CustomPropsSchema, PropsSchema } from "./properties";

export const Accordion = "Accordion";
export const Alert = "Alert";
export const AlertDialog = "AlertDialog";
export const AspectRatio = "AspectRatio";
export const Avatar = "Avatar";
export const Badge = "Badge";
export const Breadcrumb = "Breadcrumb";
export const Button = "Button";
export const Calendar = "Calendar";
export const Card = "Card";
export const Carousel = "Carousel";
export const Chart = "Chart";
export const Checkbox = "Checkbox";
export const Collapsible = "Collapsible";
export const Command = "Command";
export const ContextMenu = "ContextMenu";
export const Dialog = "Dialog";
export const Drawer = "Drawer";
export const DropdownMenu = "DropdownMenu";
export const Form = "Form";
export const HoverCard = "HoverCard";
export const Input = "Input";
export const InputOtp = "InputOtp";
export const Label = "Label";
export const Menubar = "Menubar";
export const NavigationMenu = "NavigationMenu";
export const Pagination = "Pagination";
export const Popover = "Popover";
export const Progress = "Progress";
export const RadioGroup = "RadioGroup";
export const Resizable = "Resizable";
export const ScrollArea = "ScrollArea";
export const Select = "Select";
export const Separator = "Separator";
export const Sheet = "Sheet";
export const Sidebar = "Sidebar";
export const Skeleton = "Skeleton";
export const Slider = "Slider";
export const Sonner = "Sonner";
export const Switch = "Switch";
export const Table = "Table";
export const Tabs = "Tabs";
export const Textarea = "Textarea";
export const Toast = "Toast";
export const Toggle = "Toggle";
export const ToggleGroup = "ToggleGroup";
export const Tooltip = "Tooltip";
export const HContainer = "HContainer";
export const DTable = "DTable";
export const Barchart = "Barchart";
export const TextBlock = "TextBlock";

// export type ComponentElementType =
//   | typeof Accordion
//   | typeof Alert
//   | typeof AlertDialog
//   | typeof AspectRatio
//   | typeof Avatar
//   | typeof Badge
//   | typeof Breadcrumb
//   | typeof Button
//   | typeof Calendar
//   | typeof Card
//   | typeof Carousel
//   | typeof Chart
//   | typeof Checkbox
//   | typeof Collapsible
//   | typeof Command
//   | typeof ContextMenu
//   | typeof Dialog
//   | typeof Drawer
//   | typeof DropdownMenu
//   | typeof Form
//   | typeof HoverCard
//   | typeof Input
//   | typeof InputOtp
//   | typeof Label
//   | typeof Menubar
//   | typeof NavigationMenu
//   | typeof Pagination
//   | typeof Popover
//   | typeof Progress
//   | typeof RadioGroup
//   | typeof Resizable
//   | typeof ScrollArea
//   | typeof Select
//   | typeof Separator
//   | typeof Sheet
//   | typeof Sidebar
//   | typeof Skeleton
//   | typeof Slider
//   | typeof Sonner
//   | typeof Switch
//   | typeof Table
//   | typeof Tabs
//   | typeof Textarea
//   | typeof Toast
//   | typeof Toggle
//   | typeof ToggleGroup
//   | typeof Tooltip;

export type ComponentElementType =
  | typeof Input
  | typeof Button
  | typeof HContainer
  | typeof Form
  | typeof DTable
  | typeof Barchart
  | typeof TextBlock;

export type ComponentLibraryListItem = {
  icon: React.ReactElement;
  label: string;
};

export type ComponentElementInstance = {
  id: string;
  type: ComponentElementType;
  props: PropsSchema | typeof JSONZType;
  children: (ComponentElementInstance | null)[];
  parentId: string | null;
};

export type ComponentElement = {
  create: (
    id: string,
    customProps?: CustomPropsSchema,
    parentId?: string
  ) => ComponentElementInstance;
  type: ComponentElementType;
  componentLibraryListItem: ComponentLibraryListItem;
  designerComponent: React.FC<{ elementInstance: ComponentElementInstance }>;
  dragOverlayComponent: React.FC;
  renderComponent: React.FC<{ elementInstance: ComponentElementInstance }>;
  propertiesComponent: React.FC<{ elementInstance: ComponentElementInstance }>;
  showInDesignerPanel: boolean;
};

export type ComponentElementRegister = {
  [key in ComponentElementType]: ComponentElement;
};
