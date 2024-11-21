const setToken = async (key, value) => {
  localStorage.setItem(key, value);
};

const getToken = async (key) => {
  return localStorage.getItem(key);
};

export { setToken, getToken };
