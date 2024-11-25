import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import useVersionStore from "@/store/version-store";
import useWorkspaceStore from "@/store/workspace-store";
import { Reviewer } from "@/types/api/page";
import { includes } from "lodash";
import RequestReview from "./publish-lifecycle/request-review";

export default function VersionTitle() {
  const { currentUser } = useWorkspaceStore();
  const { currentVersion, currentVersionReviewers } = useVersionStore();
  if (!currentVersion) return;
  const { name, workspace, project, page, currentStatus } = currentVersion;

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
        <Button
          variant="default"
          className={cn(!workspace.isUserWorkspace ? "mr-2" : "mr-0")}
          onClick={handleViewPublishedPage}
        >
          View Published Page
        </Button>
        {currentStatus === "DRAFT" && (
          <RequestReview
            version={currentVersion}
            showExistingReviewers={false}
          />
        )}
        {currentStatus === "PENDING_REVIEW" && (
          <>
            {!includes(currentVersionReviewerIds, currentUser.id) && (
              <RequestReview
                version={currentVersion}
                showExistingReviewers={true}
              />
            )}
            {includes(currentVersionReviewerIds, currentUser.id) && (
              <>
                <Button
                  variant="ghost"
                  className="bg-green-600 text-white mr-2"
                >
                  Approve
                </Button>
                <Button variant="destructive">Reject</Button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
