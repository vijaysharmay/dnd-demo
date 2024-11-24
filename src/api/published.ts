export const getPublishedAppByRoute = async (name: string) => {
  const url = `http://localhost:3000/published/${name}`;
  const response = await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  });

  if (response.status !== 200) {
    throw new Error(`Server Error: ${JSON.stringify(response.text())}`);
  }

  const data = await response.json();

  return data;
};
