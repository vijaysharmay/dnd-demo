import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE, RouterModule } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AccordModule } from './accord/accord.module';
import { ActionModule } from './action/action.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { BlockModule } from './block/block.module';
import { FlowModule } from './flow/flow.module';
import { PageModule } from './page/page.module';
import { ProjectModule } from './project/project.module';
import { PublishedModule } from './published/published.module';
import { UserModule } from './user/user.module';
import { VersionModule } from './version/version.module';
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
                    path: ':pageId/version',
                    module: VersionModule,
                    children: [
                      {
                        path: ':versionId/block',
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
              {
                path: ':projectId/accord',
                module: AccordModule,
              },
            ],
          },
        ],
      },
    ]),
    ActionModule,
    UserModule,
    AuthModule,
    AccordModule,
    PublishedModule,
    VersionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
