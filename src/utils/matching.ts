import { User, Post } from '../types';

export function extractSkillsFromPost(post: Post): string[] {
  const line = (post.content || '').split('\n').find(l => /Skills:/i.test(l));
  if (!line) return [];
  return line.replace(/^Skills:\s*/i, '').split(/[,\s]+/).filter(Boolean).map(s => s.toLowerCase());
}

export function overlapScore(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const aset = new Set(a.map(s => s.toLowerCase()));
  const bset = new Set(b.map(s => s.toLowerCase()));
  let inter = 0;
  bset.forEach(s => { if (aset.has(s)) inter++; });
  return inter / Math.max(aset.size, bset.size);
}

export function recencyBoost(dateStr?: any): number {
  try {
    const t = new Date(dateStr || Date.now()).getTime();
    const days = (Date.now() - t) / (1000*60*60*24);
    if (days <= 1) return 1.0;
    if (days <= 7) return 0.7;
    if (days <= 30) return 0.4;
    return 0.2;
  } catch { return 0.2; }
}

export function mentorScore(student: User, mentor: User): number {
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());
  const skills = overlapScore(studentSkills, mentorSkills); // 0..1
  const affinity = (
    (student.department && mentor.department && student.department === mentor.department ? 0.3 : 0) +
    (student.startup && mentor.company ? 0.1 : 0)
  );
  const verified = mentor.isVerified ? 0.2 : 0;
  return skills * 0.7 + affinity * 0.2 + verified * 0.1;
}

export function jobScore(student: User, post: Post): number {
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const req = extractSkillsFromPost(post);
  const skills = overlapScore(studentSkills, req);
  const recent = recencyBoost(post.createdAt);
  const verified = post.author?.isVerified ? 0.1 : 0;
  return skills * 0.7 + recent * 0.2 + verified * 0.1;
}
