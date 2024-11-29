import { ThemeProvider } from "@/components/theme-provider";
import { PathPattern, Redirect, Route, RouteProps, Switch } from "wouter";

import AppRenderer from "./pages/app";
import Auth from "./pages/auth";
import Home from "./pages/home";
import Page from "./pages/page";
import Project from "./pages/project";
import Version from "./pages/version";
import Preview from "./pages/version/preview";
import Workspace from "./pages/workspace";

const ProtectedRoute = (props: RouteProps<undefined, PathPattern>) => {
  return sessionStorage.getItem("accessToken") ? (
    <Route {...props} />
  ) : (
    <Redirect to="/" />
  );
};

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Auth}></Route>

        <Route path="/app/:appId" component={AppRenderer} nest></Route>

        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute
            path="/workspace/:workspaceId"
            component={Workspace}
          />
          <ProtectedRoute
            path="/workspace/:workspaceId/project/:projectId"
            component={Project}
          />
          <ProtectedRoute
            path="/workspace/:workspaceId/project/:projectId/page/:pageId"
            component={Page}
          />
          <ProtectedRoute
            path="/workspace/:workspaceId/project/:projectId/page/:pageId/version/:versionId/preview"
            component={Preview}
          />
          <ProtectedRoute
            path="/workspace/:workspaceId/project/:projectId/page/:pageId/version/:versionId"
            component={Version}
          />
        </ThemeProvider>
      </Switch>
    </>
  );
}
