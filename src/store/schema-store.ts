import { ConcordSchema } from "@/types/schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SchemaState {
  schemas: Record<string, ConcordSchema>;
  upsertSchema: (key: string, schema: ConcordSchema) => void;
  removeSchema: (key: string) => void;
}

const useSchemaStore = create<SchemaState>()(
  devtools(
    persist(
      (set, get) => ({
        schemas: {},
        upsertSchema: (key: string, schema: ConcordSchema) => {
          set({
            schemas: {
              ...get().schemas,
              [key]: schema,
            },
          });
        },
        removeSchema: (key: string) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: value, ...schemaWithoutKey } = get().schemas;
          set({
            schemas: schemaWithoutKey,
          });
        },
      }),
      { name: "schemaStore" }
    )
  )
);

export default useSchemaStore;
