import {
  CreateAccordRequestSchema,
  deleteAccordInProjectWorkspace,
  deleteBulkAccordInProjectWorkspace,
  getAccordsInProjectWorkspace,
  updateAccordInProjectWorkspace,
} from "@/api/accord";
import DataTable from "@/components/ui/data-table";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnMapping } from "@/types/datatable";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CreateAccordForm from "./create-accord-form";

export default function ShowAccordsTable({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const [columns, setColumns] = useState<ColumnMapping[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ["getAccordsForProject", workspaceId, projectId],
    queryFn: () => getAccordsInProjectWorkspace(workspaceId, projectId),
  });

  const updateAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      accordId,
      values,
    }: {
      workspaceId: string;
      projectId: string;
      accordId: string;
      values: CreateAccordRequestSchema;
    }) =>
      updateAccordInProjectWorkspace(workspaceId, projectId, accordId, values),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const deleteAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      accordId,
    }: {
      workspaceId: string;
      projectId: string;
      accordId: string;
    }) => deleteAccordInProjectWorkspace(workspaceId, projectId, accordId),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const deleteBulkAccordMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      accordIds,
    }: {
      workspaceId: string;
      projectId: string;
      accordIds: string[];
    }) => deleteBulkAccordInProjectWorkspace(workspaceId, projectId, accordIds),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  useEffect(() => {
    if (data && !isPending && !error) {
      setColumns([
        { columnName: "Name", columnAttrName: "accordName" },
        { columnName: "Type", columnAttrName: "accordType" },
        { columnName: "Version", columnAttrName: "accordVersion" },
        { columnName: "API URL", columnAttrName: "accordAPIUrl" },
      ]);
    }
  }, [data, isPending, error]);

  return (
    <>
      {isPending && <Skeleton className="w-full h-12 rounded-full" />}
      {error && <div>{error.message}</div>}
      {data && (
        <div>
          <DataTable
            data={data}
            columnMapping={columns}
            addRowForm={(initialValues) => (
              <AddRowForm
                workspaceId={workspaceId}
                projectId={projectId}
                initialValues={initialValues}
              />
            )}
            updateMutation={updateAccordMutation}
            deleteMutation={deleteAccordMutation}
            deleteBulkMutation={deleteBulkAccordMutation}
          />
        </div>
      )}
    </>
  );
}

function AddRowForm({
  workspaceId,
  projectId,
  initialValues,
}: {
  workspaceId: string;
  projectId: string;
  initialValues: CreateAccordRequestSchema;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Add Accord</SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <CreateAccordForm
        workspaceId={workspaceId}
        projectId={projectId}
        initialValues={initialValues}
      />
      <SheetFooter></SheetFooter>
    </>
  );
}
