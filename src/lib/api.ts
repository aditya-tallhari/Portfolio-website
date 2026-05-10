import { api, apiClient } from "./apiClient";

// ─── Interfaces ──────────────────────────────────────────────────


export interface Song {
  url: string;
  cover: string;
  title: string;
  channel: string;
}

export interface PlaylistResponse {
  status: string;
  results: number;
  data: {
    playlist: Song[];
  };
}

export interface RandomTrackResponse {
  status: string;
  data: {
    track: Song;
    id: number;
  };
}

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[]; // Backend returns an array: [{ type: String }]
  links: {
    github: string;
    live: string;
  };
  isFeatured: boolean;
  order: number;
  image?: any;
  imageUrl?: string;
}

export interface Experience {
  _id?: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  highlights: string[];
  isInternship: boolean;
  startDate: string;
}

export interface Skill {
  name: string;
  proficiency: number;
}

export interface Education {
  _id?: string;
  label: string;
  degree: string;
  specialization: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  desc: string;
  tags: string[];
  imageUrl?: string;
  accent?: string;
  order?: number;
}

export interface TechStack {
  _id?: string;
  category: string;
  icon: string;
  skills: Skill[];
}

export interface PublicStats {
  projects: number;
  experience: number;
  views: number;
  clients: number;
}

// ─── Auth APIs ───────────────────────────────────────────────────

export const login = async (credentials: any) => {
  return api.post("/auth/login", credentials);
};

export const fetchDashboardStats = async (token: string) => {
  return api.get("/dashboard-stats", { token });
};

// ─── Project APIs ────────────────────────────────────────────────

export const fetchProjects = async (): Promise<Project[]> => {
  const data = await api.get("/projects");
  return data.data;
};

export const createProject = async (projectData: FormData, token: string) => {
  return api.post("/projects", projectData, { token });
};

export const updateProject = async (id: string, projectData: FormData, token: string) => {
  return api.put(`/projects/${id}`, projectData, { token });
};

export const deleteProject = async (id: string, token: string) => {
  return api.delete(`/projects/${id}`, { token });
};

// ─── Experience APIs ─────────────────────────────────────────────

export const fetchExperience = async (): Promise<Experience[]> => {
  const data = await api.get("/experience");
  return data.data;
};

export const addExperience = async (experienceData: Partial<Experience>, token: string) => {
  return api.post("/experience", experienceData, { token });
};

export const updateExperience = async (id: string, experienceData: Partial<Experience>, token: string) => {
  return api.put(`/experience/${id}`, experienceData, { token });
};

export const deleteExperience = async (id: string, token: string) => {
  return api.delete(`/experience/${id}`, { token });
};

// ─── Education APIs ──────────────────────────────────────────────

export const fetchEducation = async (): Promise<Education[]> => {
  const data = await api.get("/education");
  return data.data;
};

export const addEducation = async (educationData: Partial<Education> | FormData, token: string) => {
  return api.post("/education", educationData, { token });
};

export const updateEducation = async (id: string, educationData: Partial<Education> | FormData, token: string) => {
  return api.put(`/education/${id}`, educationData, { token });
};

export const deleteEducation = async (id: string, token: string) => {
  return api.delete(`/education/${id}`, { token });
};

// ─── Tech Stack APIs ─────────────────────────────────────────────

export const fetchTechStack = async (): Promise<TechStack[]> => {
  const data = await api.get("/techstack");
  return data.data;
};

export const addTechStack = async (techStackData: Partial<TechStack>, token: string) => {
  return api.post("/techstack", techStackData, { token });
};

// ─── Music APIs ──────────────────────────────────────────────────

export const fetchPlaylist = async (): Promise<Song[]> => {
  const data: PlaylistResponse = await api.get("/music/playlist");
  return data.data.playlist;
};

export const fetchRandomTrack = async (): Promise<{ track: Song; id: number }> => {
  const data: RandomTrackResponse = await api.get("/music/random");
  return data.data;
};

// ─── GitHub APIs ────────────────────────────────────────────────

export const fetchGithubStats = async () => {
  return api.get("/github/stats");
};

export const fetchGithubActivity = async () => {
  return api.get("/github/activity");
};

// ─── Message / Contact APIs ──────────────────────────────────────

export const sendContactMessage = async (messageData: any) => {
  return api.post("/messages/contact", messageData);
};

export const recordVisitor = async () => {
  return api.post("/messages/visitor");
};

// ─── System / AI APIs ────────────────────────────────────────────

export const checkSystemHealth = async () => {
  // Use apiClient but with a modified base path logic if needed, 
  // or just handle it directly if it's a one-off root level call.
  // Health endpoint is at root level, not under /api/v1
  return apiClient("/health", { 
    headers: { "x-base-path-override": "true" } 
  }).catch(async () => {
    // Fallback if the override logic in apiClient isn't there yet (keep it simple for now)
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace('/api/v1', '') || 
                    (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://aditya-tallhari-portfolio.vercel.app");
    const response = await fetch(`${baseUrl}/health`);
    return response.json();
  });
};

export interface VFSResponse {
  status: string;
  data: {
    vfs: {
      [key: string]: any;
    };
  };
}

export const fetchVFS = async (): Promise<VFSResponse> => {
  return api.get("/system/vfs");
};

export const fetchPublicStats = async (): Promise<PublicStats> => {
  const data = await api.get("/system/stats");
  return data.data;
};

export const sendAIChat = async (question: string) => {
  return api.post("/ai/chat", { question });
};

export const fetchAdminMessages = async (token: string) => {
  return api.get("/messages/admin", { token });
};

export const markMessageRead = async (id: string, token: string) => {
  return api.patch(`/messages/admin/${id}`, { status: "read" }, { token });
};

export const deleteMessage = async (id: string, token: string) => {
  return api.delete(`/messages/admin/${id}`, { token });
};

// ─── Coding Profile APIs ─────────────────────────────────────────

export interface CodingProfileResponse {
  status: string;
  data: {
    leetcode?: {
      solved: {
        easy: number;
        medium: number;
        hard: number;
        total: number;
      };
      rating: number;
      rank: number;
      calendar?: Record<string, number>;
      streak?: number;
      topPercentage?: number;
      efficiency?: number;
    };
    codechef?: {
      rating: number;
      stars: string;
      globalRank: number;
      countryRank: number;
      maxRank?: number;
      solved: number;
      streak: number;
      efficiency?: number;
      activityHistory?: Array<{ value: number; active: boolean }>;
    };
  };
}

export const fetchLeetCodeProfile = async (): Promise<CodingProfileResponse> => {
  return api.get("/coding-profile/leetcode");
};

export const fetchCodeChefProfile = async (): Promise<CodingProfileResponse> => {
  return api.get("/coding-profile/codechef");
};
