import { getPublishedAppByRoute } from "@/api";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { libraryElements } from "@/elements";
import { blockToElement, buildBlockHierarchy } from "@/lib/utils";
import { BlockSchema } from "@/types/api/page";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, useParams, useRoute, useSearch } from "wouter";
import { Block, Page, Project } from "./published-apps";

export default function AppRenderer() {
  const { appId: name } = useParams();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const versionName = searchParams.get("versionName") || "main";

  const { isPending, error, data } = useQuery({
    queryKey: ["getPublishedAppByRoute", name],
    queryFn: () => getPublishedAppByRoute(name),
  });

  if (!name) return <></>;

  if (error) return <div>{error.message}</div>;

  return (
    !isPending && (
      <Layout name={data.name} projects={data.projects}>
        <Route path="/">Welcome to {data.name} App</Route>
        {data.projects.map((project: Project) => {
          return project.pages.map((page: Page) => {
            const pageRoute = `/${project.route}/${page.route}`;
            let blocks = [];
            const version = page.versions.filter((x) => x.name === versionName);
            if (version && version.length > 0) {
              blocks = version[0].blocks;
            } else {
              blocks = page.versions.filter((x) => x.name === "main")[0].blocks;
            }
            return (
              <PageRenderer
                key={page.route}
                pageRoute={pageRoute}
                pageName={page.name}
                projectName={project.name}
                blocks={blocks} //expects only one version
              />
            );
          });
        })}
      </Layout>
    )
  );
}

function PageRenderer({
  pageRoute,
  pageName,
  projectName,
  blocks,
}: {
  pageRoute: string;
  pageName: string;
  projectName: string;
  blocks: Block[];
}) {
  const [match, params] = useRoute(pageRoute);

  if (match) {
    return (
      <div className="w-full">
        <p>
          Rendering page {pageName} in project {projectName}. They have the
          below blocks
        </p>
        {buildBlockHierarchy(blocks).map((block: BlockSchema) => {
          const element = blockToElement(block);
          const RenderComponent = libraryElements[element.type].renderComponent;
          return <RenderComponent key={element.id} elementInstance={element} />;
        })}
      </div>
    );
  } else {
    return null;
  }
}

function Layout({
  name,
  projects,
  children,
}: {
  name: string;
  projects: Project[];
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link to="/">{name}</Link>
        </SidebarHeader>
        <SidebarContent>
          {projects.map((project: Project) => {
            return (
              <SidebarGroup key={project.route}>
                <SidebarGroupLabel>{project.name}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {project.pages.map((page: Page) => (
                      <SidebarMenuItem key={page.name}>
                        <SidebarMenuButton asChild>
                          <Link to={`/${project.route}/${page.route}`}>
                            <span>{page.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      </Sidebar>
      <main className="p-2 w-full">{children}</main>
    </SidebarProvider>
  );
}
