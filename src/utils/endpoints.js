export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },
  profile: "/users/me",
  categories: {
    getAll: "/categories",
  },
  templates: {
    getAll: "/templates",
  },
  queries: {
    getAll: "/queries",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
};
