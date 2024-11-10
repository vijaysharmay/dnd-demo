import { JSONSchema7 } from "json-schema";

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
  schema: JSONSchema7;
  sampleData: ConcordJsonValue[];
}
