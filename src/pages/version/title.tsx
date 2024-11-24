import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useVersionStore from "@/store/page-store";

export default function VersionTitle() {
  const { currentVersion } = useVersionStore();

  if (!currentVersion) return;
  const { name, workspace, project, page } = currentVersion;

  const handleViewPublishedPage = () => {
    const baseUrl = `/app/${workspace.route}/${project.route}/${page.route}`;
    window.open(baseUrl, "_blank");
  };

  return (
    <>
      <div>{name}</div>
      <div className="grow"></div>
      <div className="ml-auto">
        <Button
          variant="outline"
          className={cn(
            "bg-blue-600 text-white",
            !workspace.isUserWorkspace ? "mr-2" : "mr-0"
          )}
          onClick={handleViewPublishedPage}
        >
          View Published Page
        </Button>
        {!workspace.isUserWorkspace && (
          <Button
            className={cn(
              "bg-green-600 text-white",
              !workspace.isUserWorkspace ? "mr-2" : "mr-0"
            )}
          >
            Publish
          </Button>
        )}
      </div>
    </>
  );
}
