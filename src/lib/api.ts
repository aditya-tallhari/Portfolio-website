const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

// ─── Auth APIs ───────────────────────────────────────────────────
export const login = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const fetchDashboardStats = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// ─── Project APIs ────────────────────────────────────────────────
export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  return response.json();
};

// ─── Experience APIs ─────────────────────────────────────────────
export const fetchExperience = async () => {
  const response = await fetch(`${API_BASE_URL}/experience`);
  return response.json();
};

// ─── Tech Stack APIs ─────────────────────────────────────────────
export const fetchTechStack = async () => {
  const response = await fetch(`${API_BASE_URL}/techstack`);
  return response.json();
};

// ─── Message / Contact APIs ──────────────────────────────────────
export const sendContactMessage = async (messageData: any) => {
  const response = await fetch(`${API_BASE_URL}/messages/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  return response.json();
};

export const recordVisitor = async () => {
  const response = await fetch(`${API_BASE_URL}/messages/visitor`, {
    method: "POST",
  });
  return response.json();
};

// ─── System / AI APIs ────────────────────────────────────────────
export const checkSystemHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/system/health`);
  return response.json();
};

export const getAIStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/ai/status`);
  return response.json();
};

