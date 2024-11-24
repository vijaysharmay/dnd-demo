export type Root = {
  name: string;
  route: string;
  projects: Project[];
};

export type Project = {
  name: string;
  route: string;
  pages: Page[];
};

export type Page = {
  name: string;
  route: string;
  versions: Version[];
};

export type Version = {
  blocks: Block[];
};

export type Block = {
  id: string;
  parentId: string | null;
  children: Block[];
  blockType: string;
  props: Props;
  depth: number;
  position: number;
};
