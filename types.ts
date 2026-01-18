
export interface ShortLink {
  label: string;
  url: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  password?: string; // Only stored locally for simulation
  avatar?: string;
}

export interface ContentEntry {
  id: string;
  title: string;
  description: string;
  category: 'Anime' | 'Cartoon' | 'App' | 'Game';
  thumbnailUrl: string;
  tags: string[];
  links: ShortLink[];
  authorId: string;
  authorName: string;
  createdAt: number;
  rating: number;
  views: number;
  comments: Comment[];
  safetyRating?: 'Safe' | 'Caution' | 'Unknown';
}

export type Category = 'All' | 'Anime' | 'Cartoon' | 'App' | 'Game';
