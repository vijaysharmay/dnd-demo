import { Composer, Thread } from "@liveblocks/react-ui";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useClient,
} from "@liveblocks/react/suspense";

import VersionOptionWrapper from "./version-option-wrapper";

import { getLiveblocksProps } from "@/api/messages";
import { BaseMetadata, ThreadData } from "@liveblocks/client";
import "@liveblocks/react-ui/styles.css";
import { useEffect, useState } from "react";
import { useParams } from "wouter";

export default function Messages() {
  return (
    <VersionOptionWrapper title="Messages">
      <div className="w-full p-1 rounded-lg border-2">
        <LiveBlocksContainer />
      </div>
    </VersionOptionWrapper>
  );
}

export function LiveBlocksContainer() {
  const { workspaceId, versionId } = useParams();
  if (!workspaceId || !versionId) return;
  const roomId = `${workspaceId}:version:${versionId}`;
  return (
    <LiveblocksProvider {...getLiveblocksProps}>
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <Room id={roomId} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export function Room({ id }: { id: string }) {
  const client = useClient();
  const { room, leave } = client.enterRoom(id);
  const [threads, setThreads] = useState<ThreadData<BaseMetadata>[]>([]);

  useEffect(() => {
    (async () => {
      const { threads } = await room.getThreads();
      setThreads(threads);
    })();

    return () => {
      leave();
    };
  }, [leave, room]);

  return (
    <div>
      {threads.map((thread) => (
        <Thread
          key={thread.id}
          thread={thread}
          showAttachments={false}
          showActions={true}
        />
      ))}
      <Composer />
    </div>
  );
}
