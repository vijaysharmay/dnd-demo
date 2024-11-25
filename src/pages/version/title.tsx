import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useVersionStore from "@/store/page-store";

export default function VersionTitle() {
  const { currentVersion } = useVersionStore();

  if (!currentVersion) return;
  const { name, workspace, project, page, currentStatus } = currentVersion;

  const handleViewPublishedPage = () => {
    const baseUrl = `/app/${workspace.route}/${project.route}/${page.route}?versionName=${name}`;
    window.open(baseUrl, "_blank");
  };

  return (
    <>
      <div>{name}</div>
      <div className="grow"></div>
      <div className="ml-auto">
        <Button
          variant="default"
          className={cn(!workspace.isUserWorkspace ? "mr-2" : "mr-0")}
          onClick={handleViewPublishedPage}
        >
          View Published Page
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            {!workspace.isUserWorkspace && (
              <Button
                className={cn(!workspace.isUserWorkspace ? "mr-2" : "mr-0")}
              >
                {currentStatus === "DRAFT" && "Request Review"}
                {currentStatus === "APPROVED" && "Publish"}
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent>
            <Button>Request</Button>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
