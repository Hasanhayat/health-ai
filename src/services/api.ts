import axios from "axios";
let baseURL = "";

const protocol = window.location.protocol;

if (protocol === "https:") {
  baseURL = "https://heathcare-plus-backend.vercel.app/api";
} else if (protocol === "http:") {
  baseURL = "http://localhost:5000/api";
}
// Create axios instance with base URL
const api = axios.create({
  baseURL: baseURL, // Update this to your actual backend URL in production
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};

// Family Member APIs
export const familyMemberAPI = {
  getAll: async () => {
    const response = await api.get("/family-members");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/family-members/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    age: number;
    gender: string;
    relationship: string;
  }) => {
    const response = await api.post("/family-members", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(
      `/family-members/${id}`,
      data,
    );
    return response.data;
  },

  getReports: async (id: string) => {
    const response = await api.get(
      `/family-members/${id}/reports`,
    );
    return response.data;
  },

  uploadReport: async (id: string, formData: FormData) => {
    const response = await api.post(
      `/family-members/${id}/reports`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

// AI APIs
export const aiAPI = {
  healthQuery: async (question: string) => {
    const response = await api.post("/ai/health-query", {
      question,
    });
    return response.data;
  },
};

export default api;