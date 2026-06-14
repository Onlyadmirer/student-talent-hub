import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;

export const authApi = {
  login: (username: string, password: string) =>
    api.post("/users/login", new URLSearchParams({ username, password }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),
  register: (data: Record<string, unknown>) =>
    api.post("/users/register", data),
  getMe: () => api.get("/users/me"),
};

export const userApi = {
  updateProfile: (data: Record<string, unknown>) =>
    api.patch("/users/me", data),
  getDashboardStats: () => api.get("/users/me/dashboard-stats"),
  getAll: (params?: Record<string, unknown>) => api.get("/users/", { params }),
  getById: (id: number) => api.get(`/users/${id}`),
};

export const projectApi = {
  getAll: () => api.get("/projects/"),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: Record<string, unknown>) => api.post("/projects/", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.patch(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  addContributor: (data: {
    user_id: number;
    project_id: number;
    role: string;
  }) => api.post(`/projects/${data.project_id}/contributors`, { user_id: data.user_id, role: data.role }),
  getContributors: (projectId: number) =>
    api.get(`/projects/${projectId}/contributors`),
};

export const skillApi = {
  getMySkills: () => api.get("/skills/users/me"),
  getCategories: () => api.get("/skills/"),
  addSkill: (data: { skill_id: number; proficiency_level: string }) =>
    api.post("/skills/users/me", data),
  updateSkill: (id: number, data: { proficiency_level?: string }) =>
    api.patch(`/skills/users/me/${id}`, data),
  deleteSkill: (id: number) => api.delete(`/skills/users/me/${id}`),
  getByUser: (userId: number) => api.get(`/skills/users/${userId}`),
  getBulk: (userIds: number[]) => api.get("/skills/bulk", { params: { user_ids: userIds.join(",") } }),
};

export const endorsementApi = {
  getAll: () => api.get("/endorsements/"),
  getByProject: (projectId: number) =>
    api.get(`/endorsements/?project_id=${projectId}`),
  create: (data: Record<string, unknown>) =>
    api.post("/endorsements/", data),
};

export const searchApi = {
  all: (q: string) => api.get("/search/", { params: { q } }),
};
