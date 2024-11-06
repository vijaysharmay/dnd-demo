import { Module } from '@nestjs/common';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { ActionModule } from './action/action.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './block/block.module';
import { FlowModule } from './flow/flow.module';
import { PageModule } from './page/page.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    WorkspaceModule,
    ProjectModule,
    PageModule,
    BlockModule,
    FlowModule,
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'workspace',
        module: WorkspaceModule,
        children: [
          {
            path: ':workspaceId/project',
            module: ProjectModule,
            children: [
              {
                path: ':projectId/page',
                module: PageModule,
                children: [
                  {
                    path: ':pageId/block',
                    module: BlockModule,
                    children: [
                      {
                        path: ':blockId/flow',
                        module: FlowModule,
                        children: [
                          {
                            path: ':flowId/action',
                            module: ActionModule,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
    ActionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
