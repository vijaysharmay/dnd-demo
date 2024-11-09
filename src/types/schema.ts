import { Schema } from "json-schema-faker";

export type ConcordJsonObject = { [key: string]: ConcordJsonValue };

export type ConcordJsonValue =
  | null
  | boolean
  | number
  | string
  | ConcordJsonValue[]
  | ConcordJsonObject;

export interface ConcordSchema {
  name: string;
  schema: Schema;
  sampleData: ConcordJsonValue[];
}
