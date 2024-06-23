const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return "https://textadventuregameforeducation.online:3001"
  } else {
    return "http://localhost:3001"
  }
};

export default getBackendUrl;
