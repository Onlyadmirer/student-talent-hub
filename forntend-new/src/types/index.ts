export interface User {
  id: number;
  email: string;
  nim: string | null;
  name: string;
  role: string;
  status: string;
  major: string | null;
  profile_picture: string | null;
  bio: string | null;
  batch_year: string | null;
  study_program: string | null;
  created_at: string | null;
}

export interface UserSkillBrief {
  skill_id: number;
  skill_name: string;
  proficiency_level: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Contributor {
  id: number
  user_id: number
  project_id: number
  role: string
}

export interface Project {
  id: number;
  title: string;
  description: string;
  is_open: boolean;
  status: string;
  owner_id: number;
  owner_name?: string;
  thumbnail_url: string | null;
  github_link: string | null;
  figma_link: string | null;
  cover_image: string | null;
  demo_link: string | null;
  tech_stack: string | null;
  tags: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SkillCategory {
  id: number;
  name: string;
  description: string;
}

export interface UserSkill {
  id: number;
  user_id: number;
  skill_id: number;
  proficiency_level: string;
  skill_name?: string;
}

export const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%2394a3b8'/%3E%3Cpath d='M15 82 Q50 55 85 82' fill='%2394a3b8'/%3E%3C/svg%3E";

export const PLACEHOLDER_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f1f5f9'/%3E%3Ctext x='200' y='105' font-family='Arial' font-size='18' fill='%2394a3b8' text-anchor='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";

export function imgErrorHandler(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
) {
  const target = e.target as HTMLImageElement;
  if (!target.dataset.fallback) {
    target.dataset.fallback = "true";
    target.src = PLACEHOLDER_AVATAR;
  }
}

export function coverErrorHandler(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
) {
  const target = e.target as HTMLImageElement;
  if (!target.dataset.fallback) {
    target.dataset.fallback = "true";
    target.src = PLACEHOLDER_COVER;
  }
}

export interface ContributorWithUser {
  id: number;
  user_id: number;
  project_id: number;
  role: string;
  user_name: string;
  created_at: string | null;
  user: {
    id: number;
    name: string;
    profile_picture: string | null;
  } | null;
}

export interface EndorsementWithUser {
  id: number;
  from_user_id: number;
  to_user_id: number;
  skill_id: number;
  project_id: number;
  message: string;
  created_at: string | null;
  from_user_name: string | null;
  from_user_profile_picture: string | null;
}

export interface RecentProject {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  github_link: string | null;
  figma_link: string | null;
  is_open: boolean;
  status: string;
  owner_id: number;
  cover_image: string | null;
  created_at: string | null;
}

export interface DashboardStats {
  total_projects: number;
  total_skills: number;
  total_endorsements: number;
  recent_projects: RecentProject[];
  projects_count: number;
  skills_count: number;
  endorsements_count: number;
}

export interface SearchUserResult {
  id: number;
  name: string;
  nim: string | null;
  major: string | null;
}

export interface SearchProjectResult {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string | null;
  owner_name: string;
}

export interface SearchResponse {
  users: SearchUserResult[];
  projects: SearchProjectResult[];
}
