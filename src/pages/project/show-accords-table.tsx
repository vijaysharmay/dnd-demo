import { AccordSchema, deleteAccordInProjectWorkspace } from "@/api/accord";
import DataTable from "@/components/ui/data-table";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useAccordStore from "@/store/accord-store";
import { ColumnMapping } from "@/types/datatable";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import AccordForm from "./accord-form";

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
      console.error(e.message);
    },
  });

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
  };

  return (
    <>
      {accords && (
        <div>
          <DataTable
            data={accords}
            columnMapping={columns}
            rowForm={(initialValues?: AccordSchema) => (
              <AccordRowForm
                mode={initialValues ? "update" : "create"}
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

function AccordRowForm({
  mode,
  workspaceId,
  projectId,
  initialValues,
}: {
  mode: "create" | "update";
  workspaceId: string;
  projectId: string;
  initialValues?: AccordSchema;
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {mode === "create" ? "Add Accord" : "Edit Accord"}
        </SheetTitle>
        <SheetDescription>
          {mode === "create"
            ? "Create a new Accord for the project."
            : "Edit the selected Accord details."}
        </SheetDescription>
      </SheetHeader>
      <AccordForm
        mode={mode}
        workspaceId={workspaceId}
        projectId={projectId}
        accordId={initialValues?.id}
        initialValues={initialValues}
      />
      <SheetFooter />
    </>
  );
}
