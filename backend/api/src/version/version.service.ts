import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PageVersionStatus,
  VersionStatusLogApprovalStatus,
} from '@prisma/client';
import { first } from 'lodash';
import { PrismaService } from 'src/prisma.service';
import { v4 } from 'uuid';

import { CreateVersionDto } from './dto/create-version.dto';
import {
  AddReviewersDto,
  CloneVersionDto,
  PublishDto,
  UpdateVersionDto,
} from './dto/update-version.dto';

@Injectable()
export class VersionService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    createVersionDto: CreateVersionDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { name } = createVersionDto;
    const versionId = v4();
    const { id } = await this.prisma.version.create({
      data: {
        id: versionId,
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        page: {
          connect: {
            id: pageId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.DRAFT,
      },
    });
  }

  findAll(workspaceId: string, projectId: string, pageId: string) {
    return this.prisma.version.findMany({
      where: {
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  findOne(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    return this.prisma.version.findFirst({
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        page: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
        blocks: {
          include: {
            children: true,
          },
        },
        changeLog: {
          include: {
            changeOwner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
          omit: {
            changeOwnerId: true,
          },
        },
        statusLog: {
          where: {
            versionId,
          },
          orderBy: {
            changesMadeOn: 'desc',
          },
          take: 1,
          include: {
            changeOwner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
          omit: {
            changeOwnerId: true,
          },
        },
        releases: {
          include: {
            releasedBy: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
          omit: {
            releasedById: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  async update(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    updateVersionDto: UpdateVersionDto,
  ) {
    const transformedData = {
      ...updateVersionDto,
      currentStatus: updateVersionDto.currentStatus
        ? { set: updateVersionDto.currentStatus }
        : undefined, // Transform only if it exists
    };
    return this.prisma.version.update({
      data: transformedData,
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
      include: {
        project: {
          omit: {
            ownerId: true,
            workspaceId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        workspace: {
          omit: {
            ownerId: true,
          },
          include: {
            owner: {
              omit: {
                passwd: true,
                salt: true,
                userWorkspaceId: true,
              },
            },
          },
        },
        owner: {
          omit: {
            passwd: true,
            salt: true,
            userWorkspaceId: true,
          },
        },
      },
      omit: {
        ownerId: true,
        projectId: true,
        workspaceId: true,
      },
    });
  }

  async cloneVersion(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    cloneVersionDto: CloneVersionDto,
  ) {
    const existingVersion = await this.findOne(
      workspaceId,
      projectId,
      pageId,
      versionId,
    );
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { id } = await this.prisma.version.create({
      data: {
        id: v4(),
        name: cloneVersionDto.versionName,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        page: {
          connect: {
            id: pageId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    await this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.DRAFT,
      },
    });

    return this.prisma.version.update({
      where: {
        id,
      },
      data: {
        blocks: {
          createMany: {
            data: existingVersion.blocks.map(
              ({ blockType, props, depth, position }) => ({
                blockType,
                props,
                depth,
                position,
                id: v4(),
              }),
            ),
          },
        },
      },
    });
  }

  async getReviewers(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    versionStatusLogId: string,
  ) {
    const { statusLog } = await this.prisma.version.findFirst({
      where: {
        workspaceId,
        projectId,
        pageId,
        id: versionId,
      },
      select: {
        statusLog: {
          where: {
            id: versionStatusLogId,
            status: PageVersionStatus.PENDING_REVIEW,
          },
          orderBy: {
            changesMadeOn: 'desc',
          },
          take: 1,
          select: {
            approvers: {
              include: {
                approver: {
                  omit: {
                    salt: true,
                    passwd: true,
                    userWorkspaceId: true,
                  },
                },
              },
              omit: {
                approverId: true,
                versionStatusLogId: true,
                id: true,
              },
            },
          },
        },
      },
    });
    return first(statusLog);
  }

  async addReviewers(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    addReviewersDto: AddReviewersDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    await this.prisma.version.update({
      where: {
        workspaceId,
        projectId,
        pageId,
        id: versionId,
      },
      data: {
        currentStatus: PageVersionStatus.PENDING_REVIEW,
      },
    });

    const { id } = await this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id: versionId,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.PENDING_REVIEW,
      },
    });

    for (const reviewer of addReviewersDto.reviewers) {
      await this.prisma.versionStatusLogApprovers.create({
        data: {
          id: v4(),
          approver: {
            connect: {
              id: reviewer,
            },
          },
          versionStatusLog: {
            connect: {
              id,
            },
          },
          status: VersionStatusLogApprovalStatus.PENDING,
        },
      });
    }
  }

  async rejectUnpublishedVersion(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { id } = await this.prisma.version.findFirst({
      where: {
        workspaceId,
        projectId,
        pageId,
        id: versionId,
      },
    });

    const statusLog = await this.prisma.versionStatusLog.findFirst({
      where: {
        versionId: id,
      },
    });

    const approver = await this.prisma.versionStatusLogApprovers.findFirst({
      where: {
        versionStatusLogId: statusLog.id,
        approverId: ownerId,
        status: VersionStatusLogApprovalStatus.PENDING,
      },
    });

    if (!approver) {
      throw new Error('Approver record not found.');
    }

    await this.prisma.version.update({
      where: {
        id,
      },
      data: {
        currentStatus: PageVersionStatus.REJECTED,
      },
    });

    await this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.REJECTED,
      },
    });

    return this.prisma.versionStatusLogApprovers.update({
      where: { id: approver.id },
      data: {
        status: VersionStatusLogApprovalStatus.REJECTED,
      },
    });
  }

  async approveUnpublishedVersion(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const { id } = await this.prisma.version.findFirst({
      where: {
        workspaceId,
        projectId,
        pageId,
        id: versionId,
      },
    });

    const statusLog = await this.prisma.versionStatusLog.findFirst({
      where: {
        versionId: id,
        status: PageVersionStatus.PENDING_REVIEW,
      },
      orderBy: {
        changesMadeOn: 'desc',
      },
      take: 1,
    });

    const approver = await this.prisma.versionStatusLogApprovers.findFirst({
      where: {
        versionStatusLogId: statusLog.id,
        approverId: ownerId,
        status: VersionStatusLogApprovalStatus.PENDING,
      },
    });

    if (!approver) {
      throw new Error('Approver record not found.');
    }

    await this.prisma.version.update({
      where: {
        id,
      },
      data: {
        currentStatus: PageVersionStatus.APPROVED,
      },
    });

    await this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.APPROVED,
      },
    });

    return this.prisma.versionStatusLogApprovers.update({
      where: { id: approver.id },
      data: {
        status: VersionStatusLogApprovalStatus.APPROVED,
      },
    });
  }

  async publishUnpublishedVersion(
    accessToken: string,
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
    publishDto: PublishDto,
  ) {
    const { sub: ownerId } = this.jwtService.decode(accessToken);
    const parentVersion = await this.prisma.version.findFirst({
      where: {
        workspaceId,
        projectId,
        pageId,
        id: versionId,
      },
      include: {
        blocks: true,
      },
    });

    await this.prisma.version.update({
      where: {
        id: parentVersion.id,
      },
      data: {
        currentStatus: PageVersionStatus.PUBLISHED,
      },
    });

    await this.prisma.versionRelease.create({
      data: {
        id: v4(),
        parentVersion: {
          connect: {
            id: parentVersion.id,
          },
        },
        isCurrentRelease: true,
        releasedBy: {
          connect: {
            id: ownerId,
          },
        },
        pointInTimeVersion: {
          create: {
            id: v4(),
            isReleaseVersion: true,
            owner: {
              connect: {
                id: ownerId,
              },
            },
            page: {
              connect: {
                id: pageId,
              },
            },
            project: {
              connect: {
                id: projectId,
              },
            },
            workspace: {
              connect: {
                id: workspaceId,
              },
            },
            currentStatus: PageVersionStatus.PUBLISHED,
            blocks: {
              createMany: {
                data: parentVersion.blocks.map(
                  ({ blockType, props, depth, position }) => ({
                    blockType,
                    props,
                    depth,
                    position,
                    id: v4(),
                  }),
                ),
              },
            },
          },
        },
        releaseName: publishDto.releaseName,
      },
    });

    return this.prisma.versionStatusLog.create({
      data: {
        id: v4(),
        version: {
          connect: {
            id: parentVersion.id,
          },
        },
        changeOwner: {
          connect: {
            id: ownerId,
          },
        },
        status: PageVersionStatus.PUBLISHED,
      },
    });
  }

  async remove(
    workspaceId: string,
    projectId: string,
    pageId: string,
    versionId: string,
  ) {
    await this.prisma.version.delete({
      where: {
        id: versionId,
        workspaceId,
        projectId,
        pageId,
      },
    });
    return;
  }
}
