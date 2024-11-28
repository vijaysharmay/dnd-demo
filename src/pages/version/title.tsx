import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  const currentVersionReviewerIds = currentVersionReviewers.map(
    (x: Reviewer) => x.approver.id
  );

  return (
    <>
      <div>{name}</div>
      <div className="grow"></div>
      <div className="ml-auto">
        {!workspace.isUserWorkspace && currentStatus === "PUBLISHED" && (
          <Button
            variant="default"
            className={cn(!workspace.isUserWorkspace ? "mr-2" : "mr-0")}
            onClick={handleViewPublishedPage}
          >
            View Published Page
          </Button>
        )}
        {currentStatus === "DRAFT" && (
          <RequestReview version={currentVersion} editMode={true} />
        )}

        {currentStatus === "PENDING_REVIEW" && (
          <>
            {!includes(currentVersionReviewerIds, currentUser.id) ? (
              <RequestReview version={currentVersion} editMode={false} />
            ) : (
              <ApproveReject version={currentVersion} />
            )}
          </>
        )}

        {currentStatus === "APPROVED" && (
          <>
            {includes(owner.id, currentUser.id) && (
              <>
                <RequestReview version={currentVersion} editMode={false} />
                <PublishVersion version={currentVersion} />
              </>
            )}
          </>
        )}

        {currentStatus === "PUBLISHED" && (
          <Button variant="ghost" className="bg-blue-600 text-white" disabled>
            <Check /> PUBLISHED
          </Button>
        )}
      </div>
    </>
  );
}
