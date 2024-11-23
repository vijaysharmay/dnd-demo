import useElementStore from "@/store/element-store";

export default function Messages() {
  const { activeElement } = useElementStore();
  if (activeElement === null) return;
  return (
    <div className="px-4 py-2 flex flex-wrap gap-2">
      <div className="text-center w-full font-semibold text-muted-foreground mb-4">
        Messages
      </div>
    </div>
  );
}
