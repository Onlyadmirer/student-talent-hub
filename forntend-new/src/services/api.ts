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
    if (err.response?.status === 401 && !err.config?.url?.includes("/login")) {
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
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/me/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getDashboardStats: () => api.get("/users/me/dashboard-stats"),
  getAll: (params?: Record<string, unknown>) => api.get("/users/", { params }),
  getById: (id: number) => api.get(`/users/${id}`),
  getByNim: (nim: string) => api.get(`/users/by-nim/${nim}`),
};

export const projectApi = {
  getAll: () => api.get("/projects/"),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: Record<string, unknown>) => api.post("/projects/", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.patch(`/projects/${id}`, data),
  uploadThumbnail: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/projects/${id}/thumbnail`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: number) => api.delete(`/projects/${id}`),
  addContributor: (data: {
    user_id: number;
    project_id: number;
    role: string;
  }) => api.post(`/projects/${data.project_id}/contributors`, { user_id: data.user_id, role: data.role }),
  getContributors: (projectId: number) =>
    api.get(`/projects/${projectId}/contributors`),
  removeContributor: (projectId: number, contributorId: number) =>
    api.delete(`/projects/${projectId}/contributors/${contributorId}`),
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
  getByUser: (userId: number) =>
    api.get(`/endorsements/?user_id=${userId}`),
  create: (data: Record<string, unknown>) =>
    api.post("/endorsements/", data),
};

export const requestApi = {
  sendRequest: (projectId: number, data: { role: string; message?: string }) =>
    api.post(`/projects/${projectId}/requests`, data),
  getProjectRequests: (projectId: number, statusFilter?: string) =>
    api.get(`/projects/${projectId}/requests`, { params: statusFilter ? { status_filter: statusFilter } : {} }),
  updateRequest: (projectId: number, requestId: number, status: string) =>
    api.patch(`/projects/${projectId}/requests/${requestId}`, { status }),
  cancelRequest: (projectId: number, requestId: number) =>
    api.delete(`/projects/${projectId}/requests/${requestId}`),
  getMyRequests: () => api.get("/projects/requests/me"),
};

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
  updateUserStatus: (userId: number, status: string) =>
    api.patch(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  getProjects: () => api.get("/admin/projects"),
  deleteProject: (projectId: number) => api.delete(`/admin/projects/${projectId}`),
  getSkillCategories: () => api.get("/admin/skills/categories"),
  createSkillCategory: (data: { name: string; description: string }) =>
    api.post("/admin/skills/categories", data),
  deleteSkillCategory: (categoryId: number) => api.delete(`/admin/skills/categories/${categoryId}`),
};

export const recruiterApi = {
  getDashboard: () => api.get("/recruiters/dashboard"),
  getStudents: (params?: Record<string, unknown>) => api.get("/recruiters/students", { params }),
  getSavedStudents: () => api.get("/recruiters/saved-students"),
  saveStudent: (studentId: number) => api.post(`/recruiters/saved-students/${studentId}`),
  unsaveStudent: (studentId: number) => api.delete(`/recruiters/saved-students/${studentId}`),
  getStudentSkills: (studentId: number) => api.get(`/recruiters/students/${studentId}/skills`),
};

export const searchApi = {
  all: (q: string) => api.get("/search/", { params: { q } }),
};
