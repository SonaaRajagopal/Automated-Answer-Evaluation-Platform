const BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function uploadScripts(files: File[]) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.json();
}

export async function queryAI(query: string, database: string) {
  const response = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      database,
    }),
  });

  if (!response.ok) {
    throw new Error("Query failed");
  }

  return await response.json();
}