import {
  getExistingReviewersForVersion,
  setReviewersToUnpublishedVersion,
} from "@/api";
import { getUsers } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoComplete } from "@/containers/autocomplete";
import { cn } from "@/lib/utils";
import useVersionStore from "@/store/version-store";
import { Reviewer, VersionSchema } from "@/types/api/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import { includes } from "lodash";
import { Check, CircleDot, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RequestReview({
  version,
  editMode,
}: {
  version: VersionSchema;
  editMode: boolean;
}) {
  const { id, workspace, project, page, statusLog } = version;
  const { setCurrentVersionReviewers } = useVersionStore();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [reviewers, setReviewers] = useState<string[]>([]);
  const [existingReviewers, setExistingReviewers] = useState([]);
  const [usersForSearch, setUsersForSearch] = useState<
    {
      value: string;
      label: string;
    }[]
  >();

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["getUserList", searchValue],
    queryFn: () => getUsers(searchValue),
  });

  const { data: existingReviewersData } = useQuery({
    queryKey: [
      "getExistingReviewersForVersion",
      workspace.id,
      project.id,
      page.id,
      id,
      statusLog[0].id,
    ],
    queryFn: () =>
      getExistingReviewersForVersion(
        workspace.id,
        project.id,
        page.id,
        id,
        statusLog[0].id
      ),
  });

  useEffect(() => {
    if (users) {
      const items = users
        .filter((x) => x.id !== page.owner.id)
        .map((x) => {
          return {
            value: `${x.id}|${x.fullName}|${x.email}`,
            label: x.fullName,
          };
        });
      setUsersForSearch(items);
    }

    if (existingReviewersData) {
      setExistingReviewers(existingReviewersData);
      setCurrentVersionReviewers(existingReviewersData);
    }
  }, [existingReviewersData, page.owner.id, setCurrentVersionReviewers, users]);

  const handleAddReviewer = () => {
    const existingReviewerIds = existingReviewers.map(
      (x: Reviewer) => x.approver.id
    );
    if (
      !includes(reviewers, selectedValue) &&
      !includes(existingReviewerIds, selectedValue.split("|")[0]) &&
      selectedValue !== ""
    )
      setReviewers([...reviewers, selectedValue]);
    setSearchValue("");
    setSelectedValue("");
  };

  const [isAddReviewersDialogOpen, setIsAddReviewersDialogOpen] =
    useState<boolean>(false);

  const setReviewersMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
      reviewers,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      reviewers: string[];
    }) =>
      setReviewersToUnpublishedVersion(
        workspaceId,
        projectId,
        pageId,
        versionId,
        reviewers
      ),
    onSuccess: () => {
      setIsAddReviewersDialogOpen(false);
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const handleAddReviewers = () => {
    setReviewersMutation.mutate({
      workspaceId: workspace.id,
      pageId: page.id,
      projectId: project.id,
      versionId: id,
      reviewers: reviewers.map((x) => x.split("|")[0]),
    });
  };

  const ShowReviewer = ({ reviewer }: { reviewer: string }) => {
    const [id, fullName, email] = reviewer.split("|");
    const handleDeleteReviewer = (reviewer: string) => {
      setReviewers([...reviewers.filter((x) => x !== reviewer)]);
    };
    return (
      <div key={id} className="flex flex-row">
        <div>
          <p>{fullName}</p>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
        <Button
          variant="ghost"
          className="h-full ml-auto bg-red-200"
          onClick={() => handleDeleteReviewer(`${id}|${fullName}|${email}`)}
        >
          <Trash2 className="stroke-black" />
        </Button>
      </div>
    );
  };

  const ShowExistingReviewer = ({ reviewer }: { reviewer: Reviewer }) => {
    return (
      <div
        key={reviewer.approver.id}
        className="flex flex-row border rounded bg-gray-50 p-2"
      >
        <div>
          <p className="text-sm">{reviewer.approver.fullName}</p>
          <p className="text-muted-foreground text-sm underline">
            {reviewer.approver.email}
          </p>
        </div>
        <div className="ml-auto mt-0.5">
          <Button
            variant="outline"
            className={cn(
              "w-28 text-xs text-slate-800",
              reviewer.status === "APPROVED" && "bg-green-600",
              reviewer.status === "PENDING" && "bg-yellow-600"
            )}
          >
            {reviewer.status === "APPROVED" && <Check />}
            {reviewer.status === "PENDING" && <CircleDot />}
            {reviewer.status === "REJECTED" && <X />}
            {reviewer.status}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isAddReviewersDialogOpen}>
      <DialogTrigger asChild>
        {!workspace.isUserWorkspace && (
          <Button
            variant="default"
            className={cn(!workspace.isUserWorkspace ? "mr-2" : "mr-0")}
            onClick={() => setIsAddReviewersDialogOpen(true)}
          >
            Review Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Reviewers</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editMode && (
            <>
              <div className="flex flex-rows gap-x-2">
                <div className="w-full">
                  <AutoComplete
                    selectedValue={selectedValue}
                    onSelectedValueChange={setSelectedValue}
                    searchValue={searchValue}
                    onSearchValueChange={setSearchValue}
                    items={usersForSearch ?? []}
                    isLoading={isUsersLoading}
                    placeholder="Search users..."
                  />
                </div>
                <Button className="ml-auto" onClick={handleAddReviewer}>
                  Add
                </Button>
              </div>
              <hr />
            </>
          )}
          {existingReviewers.map((reviewer: Reviewer) => (
            <ShowExistingReviewer
              key={reviewer.approver.id}
              reviewer={reviewer}
            />
          ))}
          {editMode && (
            <>
              <hr />
              {reviewers.map((reviewer) => (
                <ShowReviewer key={reviewer} reviewer={reviewer} />
              ))}
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddReviewersDialogOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
          {reviewers.length > 0 && editMode && (
            <Button onClick={handleAddReviewers}>Save changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
