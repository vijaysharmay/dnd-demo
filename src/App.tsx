import { Route, Switch } from "wouter";

import Preview from "./containers/preview";
import Auth from "./pages/auth";
import Page from "./pages/page";
import Project from "./pages/project";
import Workspace from "./pages/workspace";

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Auth}></Route>
        <Route path="/workspace/:workspaceId" nest={true}>
          <Route path="/" component={Workspace} />
          <Route path="/project/:projectId" nest={true}>
            <Route path="/" component={Project} />
            <Route path="/page/:pageId" nest={true}>
              <Route path="/" component={Page} />
              <Route path="/preview" component={Preview} />
            </Route>
          </Route>
        </Route>
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}
