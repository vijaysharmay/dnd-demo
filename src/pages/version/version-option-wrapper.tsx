export default function VersionOptionWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement;
}) {
  return (
    <div className="p-2 flex flex-wrap gap-2">
      <div className="text-center w-full font-semibold text-muted-foreground mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}
