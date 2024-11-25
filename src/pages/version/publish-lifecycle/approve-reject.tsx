import { approveUnpublishedVersion, rejectUnpublishedVersion } from "@/api";
import { Button } from "@/components/ui/button";
import { VersionSchema } from "@/types/api/page";
import { useMutation } from "@tanstack/react-query";

export default function ApproveReject({ version }: { version: VersionSchema }) {
  const { id, workspace, project, page } = version;
  const mutationParams = {
    workspaceId: workspace.id,
    projectId: project.id,
    pageId: page.id,
    versionId: id,
  };

  const approveVersionMutation = useMutation({
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
    }) => approveUnpublishedVersion(workspaceId, projectId, pageId, versionId),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const rejectVersionMutation = useMutation({
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
    }) => rejectUnpublishedVersion(workspaceId, projectId, pageId, versionId),
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
        onClick={() => approveVersionMutation.mutate(mutationParams)}
      >
        Approve
      </Button>
      <Button
        variant="destructive"
        onClick={() => rejectVersionMutation.mutate(mutationParams)}
      >
        Reject
      </Button>
    </>
  );
}
