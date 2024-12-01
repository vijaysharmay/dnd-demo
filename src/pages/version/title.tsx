import { Button } from "@/components/ui/button";
import { BuildBlockHierarchy } from "@/lib/utils";
import useVersionStore from "@/store/version-store";
import useWorkspaceStore from "@/store/workspace-store";
import { Reviewer } from "@/types/api/page";
import { includes } from "lodash";
import { Check } from "lucide-react";

import ApproveReject from "./publish-lifecycle/approve-reject";
import PublishVersion from "./publish-lifecycle/publish";
import RequestReview from "./publish-lifecycle/request-review";

export default function VersionTitle() {
  const { currentUser } = useWorkspaceStore();
  const { currentVersion, currentVersionReviewers } = useVersionStore();
  if (!currentVersion) return;
  const { name, workspace, project, page, currentStatus, owner } =
    currentVersion;

  const handleViewPublishedPage = () => {
    const baseUrl = `/app/${workspace.route}/${project.route}/${page.route}?versionName=${name}`;
    window.open(baseUrl, "_blank");
  };

  // I dont like this
  const handlePreview = () => {
    sessionStorage.setItem(
      "previewElements",
      JSON.stringify(BuildBlockHierarchy(currentVersion.blocks))
    );
    const baseUrl = `/workspace/${workspace.id}/project/${project.id}/page/${page.id}/version/${currentVersion.id}/preview`;
    window.open(baseUrl, "_blank");
  };

  const currentVersionReviewerIds = currentVersionReviewers.map(
    (x: Reviewer) => x.approver.id
  );

  return (
    <>
      <div>{name}</div>
      <div className="grow"></div>
      <div className="ml-auto">
        <Button variant="default" className="mr-2" onClick={handlePreview}>
          Preview
        </Button>
        {!workspace.isUserWorkspace && currentStatus === "PUBLISHED" && (
          <Button
            variant="default"
            className="mr-2"
            onClick={handleViewPublishedPage}
          >
            View Published Page
          </Button>
        )}
        {!workspace.isUserWorkspace && currentStatus === "DRAFT" && (
          <RequestReview version={currentVersion} editMode={true} />
        )}

        {!workspace.isUserWorkspace && currentStatus === "PENDING_REVIEW" && (
          <>
            {!includes(currentVersionReviewerIds, currentUser.id) ? (
              <RequestReview version={currentVersion} editMode={false} />
            ) : (
              <ApproveReject version={currentVersion} />
            )}
          </>
        )}

        {!workspace.isUserWorkspace && currentStatus === "APPROVED" && (
          <>
            {includes(owner.id, currentUser.id) && (
              <>
                <RequestReview version={currentVersion} editMode={false} />
                <PublishVersion version={currentVersion} />
              </>
            )}
          </>
        )}

        {!workspace.isUserWorkspace && currentStatus === "PUBLISHED" && (
          <Button variant="ghost" className="bg-blue-600 text-white">
            <Check /> PUBLISHED
          </Button>
        )}
      </div>
    </>
  );
}
