Requirements
============

- [ ] Rendering Engine (Preview)
- [ ] API for Workspaces / Projects / Pages / Blocks / Flows / Actions
- [ ] Integrating OpenAPI Specification Support For Backend Driven UI Development
- [ ] Flow / Action Orchestration Engine
- [ ] Resizable Containers / Components
- [ ] Code Refactoring
  - [ ] Use Immer
  - [ ] Separate OnDragEnd, OnDragEnter etc into separate files
  - [ ] Properties Component Rethink
  - [ ] Evaluate Daybrush Selecto
- [ ] Ability to nest HContainer within VContainer (and vice versa) and prevent drop at a depth
- [ ] ability to group elements to a form elements
- [ ] should be able to move objects in/out from hcontainer/vcontainer
- [ ] 

Scope
=====

a workspace has multiple users with different roles. a user with the right role can create a project.
each project is associated with a route and contain pages with sub routes.

each page has blocks and each block's event listeners can be modelled as a flow.
a flow is comprised of actions (which are reusable across concord)

- openapi integration
- events
- 



TS Bugs
=======

[06:24:42.452] src/elements/button/properties.tsx(43,17)
[06:24:42.452] src/elements/button/properties.tsx(55,17)
[06:24:42.453] src/elements/button/properties.tsx(67,17)
[06:24:42.453] src/elements/button/properties.tsx(80,17)
[06:24:42.453] src/elements/common/event-mapper.ts(5,25)
[06:24:42.453] src/elements/common/form-fields.tsx(21,39)
[06:24:42.454] src/elements/dtable/designer.tsx(54,18)
[06:24:42.454] src/elements/dtable/designer.tsx(68,16)
[06:24:42.454] src/elements/dtable/designer.tsx(75,18)
[06:24:42.454] src/elements/dtable/designer.tsx(85,16)
[06:24:42.455] src/elements/dtable/properties.tsx(40,17)
[06:24:42.455] src/elements/dtable/properties.tsx(52,17)
[06:24:42.456] src/elements/dtable/properties.tsx(64,17)
[06:24:42.456] src/elements/dtable/properties.tsx(77,17)
[06:24:42.457] src/elements/dtable/render.tsx(69,18)
[06:24:42.457] src/elements/dtable/render.tsx(83,16)
[06:24:42.457] src/elements/dtable/render.tsx(90,18)
[06:24:42.457] src/elements/dtable/render.tsx(100,16)
[06:24:42.457] src/elements/hcontainer/properties.tsx(42,17)
[06:24:42.457] src/elements/hcontainer/properties.tsx(54,17)
[06:24:42.458] src/elements/hcontainer/properties.tsx(66,17)
[06:24:42.458] src/elements/input/properties.tsx(42,17)
[06:24:42.458] src/elements/input/properties.tsx(54,17)
[06:24:42.458] src/elements/input/properties.tsx(66,17)
[06:24:42.458] src/elements/input/properties.tsx(79,17)
[06:24:42.459] src/elements/input/properties.tsx(91,17)
[06:24:42.459] src/lib/utils.ts(12,33)
[06:24:42.460] src/lib/utils.ts(12,33)