import { PathPattern, Redirect, Route, RouteProps, Switch } from "wouter";

import Preview from "./containers/preview";
import Auth from "./pages/auth";
import Page from "./pages/page";
import Project from "./pages/project";
import Workspace from "./pages/workspace";
import Home from "./pages/home";

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
        <ProtectedRoute path="/home" component={Home} />
        <ProtectedRoute path="/workspace/:workspaceId" component={Workspace} />
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
      </Switch>
    </>
  );
}
