export const getBaseUrl = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  return rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
};
