const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://aditya-tallhari-portfolio.vercel.app/api/v1";

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
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const fetchDashboardStats = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
};

// ─── Project APIs ────────────────────────────────────────────────

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  const data = await response.json();
  return data.data; // Backend returns { status: 'success', results: n, data: [...] }
};

export const createProject = async (projectData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: projectData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create project");
  }
  return response.json();
};

export const updateProject = async (id: string, projectData: FormData, token: string) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: projectData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update project");
  }
  return response.json();
};

export const deleteProject = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
};

// ─── Experience APIs ─────────────────────────────────────────────

export const fetchExperience = async (): Promise<Experience[]> => {
  const response = await fetch(`${API_BASE_URL}/experience`);
  if (!response.ok) throw new Error("Failed to fetch experience");
  const data = await response.json();
  return data.data; // Backend returns { status: 'success', data: [...] }
};

export const addExperience = async (experienceData: Partial<Experience>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/experience`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error("Failed to add experience");
  return response.json();
};

export const updateExperience = async (id: string, experienceData: Partial<Experience>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error("Failed to update experience");
  return response.json();
};

export const deleteExperience = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete experience");
  return response.json();
};

// ─── Education APIs ──────────────────────────────────────────────

export const fetchEducation = async (): Promise<Education[]> => {
  const response = await fetch(`${API_BASE_URL}/education`);
  if (!response.ok) throw new Error("Failed to fetch education records");
  const data = await response.json();
  return data.data;
};

export const addEducation = async (educationData: Partial<Education>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error("Failed to add education record");
  return response.json();
};

export const updateEducation = async (id: string, educationData: Partial<Education>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error("Failed to update education record");
  return response.json();
};

export const deleteEducation = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete education record");
  return response.json();
};

// ─── Tech Stack APIs ─────────────────────────────────────────────

export const fetchTechStack = async (): Promise<TechStack[]> => {
  const response = await fetch(`${API_BASE_URL}/techstack`);
  if (!response.ok) throw new Error("Failed to fetch tech stack");
  const data = await response.json();
  return data.data; // Backend returns { status: 'success', data: [...] }
};

export const addTechStack = async (techStackData: Partial<TechStack>, token: string) => {
  const response = await fetch(`${API_BASE_URL}/techstack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(techStackData),
  });
  if (!response.ok) throw new Error("Failed to add tech stack");
  return response.json();
};

// ─── Music APIs ──────────────────────────────────────────────────

export const fetchPlaylist = async (): Promise<Song[]> => {
  const response = await fetch(`${API_BASE_URL}/music/playlist`);
  if (!response.ok) throw new Error("Failed to fetch playlist");
  const data: PlaylistResponse = await response.json();
  return data.data.playlist;
};

export const fetchRandomTrack = async (): Promise<{ track: Song; id: number }> => {
  const response = await fetch(`${API_BASE_URL}/music/random`);
  if (!response.ok) throw new Error("Failed to fetch random track");
  const data: RandomTrackResponse = await response.json();
  return data.data;
};

// ─── GitHub APIs ────────────────────────────────────────────────

export const fetchGithubStats = async () => {
  const response = await fetch(`${API_BASE_URL}/github/stats`);
  if (!response.ok) throw new Error("Failed to fetch github stats");
  return response.json();
};

export const fetchGithubActivity = async () => {
  const response = await fetch(`${API_BASE_URL}/github/activity`);
  if (!response.ok) throw new Error("Failed to fetch github activity");
  return response.json();
};

// ─── Message / Contact APIs ──────────────────────────────────────

export const sendContactMessage = async (messageData: any) => {
  const response = await fetch(`${API_BASE_URL}/messages/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export const recordVisitor = async () => {
  const response = await fetch(`${API_BASE_URL}/messages/visitor`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to record visitor");
  return response.json();
};

// ─── System / AI APIs ────────────────────────────────────────────

export const checkSystemHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/system/health`);
  if (!response.ok) throw new Error("Failed to check system health");
  return response.json();
};

export const getAIStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/ai/status`);
  if (!response.ok) throw new Error("Failed to get AI status");
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/system/vfs`);
  if (!response.ok) throw new Error("Failed to fetch VFS");
  return response.json();
};

export const fetchPublicStats = async (): Promise<PublicStats> => {
  const response = await fetch(`${API_BASE_URL}/system/stats`);
  if (!response.ok) throw new Error("Failed to fetch public stats");
  const data = await response.json();
  return data.data;
};

export const sendAIChat = async (question: string) => {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "AI response failed");
  }

  return response.json();
};

export const fetchAdminMessages = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/messages/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const markMessageRead = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/messages/admin/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "read" }),
  });
  if (!response.ok) throw new Error("Failed to mark message as read");
  return response.json();
};

export const deleteMessage = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/messages/admin/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete message");
  return response.json();
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
    };
    codechef?: {
      rating: number;
      stars: string;
      globalRank: number;
      countryRank: number;
      maxRank?: number;
      solved: number;
      streak: number;
    };
  };
}

export const fetchLeetCodeProfile = async (username: string): Promise<CodingProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/coding-profile/leetcode/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch LeetCode profile for ${username}`);
  }
  return response.json();
};

export const fetchCodeChefProfile = async (username: string): Promise<CodingProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/coding-profile/codechef/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch CodeChef profile for ${username}`);
  }
  return response.json();
};
