import { publishUnpublishedVersion } from "@/api";
import { Button } from "@/components/ui/button";
import { VersionSchema } from "@/types/api/page";
import { useMutation } from "@tanstack/react-query";

export default function PublishVersion({ version }: { version: VersionSchema }) {
  const { id, workspace, project, page } = version;
  const mutationParams = {
    workspaceId: workspace.id,
    projectId: project.id,
    pageId: page.id,
    versionId: id,
  };

  const publishVersionMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
    }) => publishUnpublishedVersion(workspaceId, projectId, pageId, versionId),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        className="bg-green-600 text-white mr-2"
        onClick={() => publishVersionMutation.mutate(mutationParams)}
      >
        Publish
      </Button>
    </>
  );
}
