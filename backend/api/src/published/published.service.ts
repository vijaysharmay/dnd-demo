import { Injectable } from '@nestjs/common';
import { PageVersionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PublishedService {
  constructor(private prisma: PrismaService) {}
  findOne(name: string, versionName: string | undefined) {
    const parsedVersionName = versionName ? versionName : 'main';
    return (
      this.prisma.workspace.findFirst({
        where: {
          route: name,
          isUserWorkspace: false,
          versions: {
            some: {
              name: parsedVersionName,
              currentStatus: PageVersionStatus.PUBLISHED,
              isReleaseVersion: true,
            },
          },
        },
        select: {
          name: true,
          route: true,
          projects: {
            select: {
              name: true,
              route: true,
              pages: {
                select: {
                  name: true,
                  route: true,
                  versions: {
                    where: {
                      name: parsedVersionName,
                      isReleaseVersion: true,
                      currentStatus: PageVersionStatus.PUBLISHED,
                    },
                    orderBy: {
                      createdOn: 'desc',
                    },
                    take: 1,
                    select: {
                      name: true,
                      blocks: {
                        select: {
                          id: true,
                          parentId: true,
                          blockType: true,
                          props: true,
                          depth: true,
                          position: true,
                          children: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }) ?? {}
    );
  }
}
