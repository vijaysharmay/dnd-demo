import { CreateAccordRequestSchema, deleteAccordInProjectWorkspace } from "@/api/accord";
import DataTable from "@/components/ui/data-table";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useAccordStore from "@/store/accord-store";
import { AccordSchema } from "@/types/api/accord";
import { ColumnMapping } from "@/types/datatable";
import { useMutation } from "@tanstack/react-query";
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
  const { accords, removeAccordById } = useAccordStore();

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
    onSuccess: ({ id }) => {
      removeAccordById(id);
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  // const deleteBulkAccordMutation = useMutation({
  //   mutationFn: async ({
  //     workspaceId,
  //     projectId,
  //     accordIds,
  //   }: {
  //     workspaceId: string;
  //     projectId: string;
  //     accordIds: string[];
  //   }) => deleteBulkAccordInProjectWorkspace(workspaceId, projectId, accordIds),
  //   onSuccess: () => {
  //     window.location.reload();
  //   },
  //   onError: (e: Error) => {
  //     console.log(e.message);
  //   },
  // });

  useEffect(() => {
    if (accords) {
      setColumns([
        { columnName: "Name", columnAttrName: "accordName" },
        { columnName: "Type", columnAttrName: "accordType" },
        { columnName: "Version", columnAttrName: "accordVersion" },
        { columnName: "API URL", columnAttrName: "accordAPIUrl" },
      ]);
    }
  }, [accords]);

  const handleRowDelete = (accordId: string) => {
    deleteAccordMutation.mutate({ workspaceId, projectId, accordId });
    window.location.reload();
  };

  return (
    <>
      {accords && (
        <div>
          <DataTable
            data={accords}
            columnMapping={columns}
            rowForm={(initialValues?: AccordSchema) => (
              <AddRowForm
                workspaceId={workspaceId}
                projectId={projectId}
                initialValues={initialValues}
              />
            )}
            handleRowDelete={handleRowDelete}
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
  initialValues: CreateAccordRequestSchema | undefined;
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
