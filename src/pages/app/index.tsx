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
import { blockToElement } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, useParams, useRoute } from "wouter";
import { Block, Page, Project } from "./published-apps";

export default function AppRenderer() {
  const { appId: name } = useParams();

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
            return (
              <PageRenderer
                key={page.route}
                pageRoute={pageRoute}
                pageName={page.name}
                projectName={project.name}
                blocks={page.blocks}
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
        {blocks.map((block: Block) => {
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
