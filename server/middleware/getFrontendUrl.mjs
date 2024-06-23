const getBackendUrl = () => {
  return process.env.FRONTEND_URL || "http://localhost:3000";
};

export default getBackendUrl;
