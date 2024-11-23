import { PathPattern, Redirect, Route, RouteProps, Switch } from "wouter";

import { ThemeProvider } from "@/components/theme-provider";
import Preview from "./pages/page/preview";
import Auth from "./pages/auth";
import Home from "./pages/home";
import Page from "./pages/page";
import Project from "./pages/project";
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
            path="/workspace/:workspaceId/project/:projectId/page/:pageId/preview"
            component={Preview}
          />
          <Route>404: No such page!</Route>
        </ThemeProvider>
      </Switch>
    </>
  );
}
