export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profileImage?: string;
  department?: string;
  graduationYear?: number;
  skills?: string[];
  company?: string;
  position?: string;
  bio?: string;
  startup?: string;
  points: number;
  badges: string[];
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  type: 'post' | 'job' | 'achievement';
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
}

export interface Startup {
  id: string;
  ownerId: string;
  owner: User;
  title: string;
  tagline: string;
  stage: 'concept' | 'prototype' | 'mvp';
  problem: string;
  solution: string;
  progress: string;
  fundingNeeded: string;
  attachments?: string[];
  likes: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface ReversePitch {
  id: string;
  authorId: string;
  author: User;
  title: string;
  description: string;
  industry: string;
  budget?: string;
  deadline?: Date;
  submissions: Submission[];
  createdAt: Date;
}

export interface Submission {
  id: string;
  studentId: string;
  student: User;
  content: string;
  attachments?: string[];
  createdAt: Date;
}

export interface Event {
  id: string;
  organizerId: string;
  organizer: User;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: 'seminar' | 'webinar' | 'reunion' | 'workshop';
  attendees: string[];
  maxAttendees?: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  tags: string[];
  answers: Answer[];
  createdAt: Date;
}

export interface Answer {
  id: string;
  authorId: string;
  author: User;
  content: string;
  upvotes: string[];
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  content: string;
  timestamp: Date;
  type: 'text' | 'file';
}