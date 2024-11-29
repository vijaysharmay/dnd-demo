export const getLiveblocksProps = {
  backgroundKeepAliveTimeout: 15 * 60 * 1000,
  lostConnectionTimeout: 5000,
  preventUnsavedChanges: true,
  throttle: 200,
  // resolveMentionSuggestions: async ({ text, roomId }) => {
  //   console.log(roomId);
  //   const workspaceUsers = await __getWorkspaceUsersFromDB__(roomId);

  //   if (!text) {
  //     // Show all workspace users by default
  //     return __getUserIds__(workspaceUsers);
  //   } else {
  //     const matchingUsers = __findUsers__(workspaceUsers, text);
  //     return __getUserIds__(matchingUsers);
  //   }
  // },
  authEndpoint: async (room) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Couldnt find access token");
    }

    const url = `http://localhost:3000/liveblocks-auth`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ room }),
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      }),
    });

    return await response.json();
  },
};
