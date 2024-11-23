import { updatePageInProjectWorkspace } from "@/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useElementStore from "@/store/element-store";
import usePageStore from "@/store/page-store";
import { ComponentElementInstance } from "@/types";
import { useMutation } from "@tanstack/react-query";

export default function PageTitle({
  workspaceId,
  projectId,
  pageId,
}: {
  workspaceId: string;
  projectId: string;
  pageId: string;
}) {
  const { currentPage } = usePageStore();
  const { elements } = useElementStore();
  const commitPageMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      elements,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      elements: ComponentElementInstance[];
    }) =>
      updatePageInProjectWorkspace(workspaceId, projectId, pageId, elements),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleCommit = () => {
    console.log({ workspaceId, projectId, pageId, elements });
  };

  if (!currentPage) return;
  const { name, workspace } = currentPage;

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
          onClick={handleCommit}
        >
          Commit
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
