import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ClipboardList, GraduationCap, Lightbulb, Plus } from 'lucide-react';

interface TargetRole {
  id: string;
  title: string;
  requiredSkills: string[];
}

interface Course {
  id: string;
  title: string;
  provider: 'SWAYAM' | 'NPTEL' | 'Coursera' | 'Internal';
  skills: string[];
  url: string;
}

const ROLES: TargetRole[] = [
  { id: 'frontend-intern', title: 'Frontend Intern', requiredSkills: ['html', 'css', 'javascript', 'react', 'git'] },
  { id: 'data-analyst-intern', title: 'Data Analyst Intern', requiredSkills: ['python', 'sql', 'excel', 'statistics', 'visualization'] },
  { id: 'backend-intern', title: 'Backend Intern', requiredSkills: ['node.js', 'api', 'databases', 'git', 'testing'] },
  { id: 'product-intern', title: 'Product Intern', requiredSkills: ['communication', 'analytics', 'wireframing', 'research'] },
];

const COURSES: Course[] = [
  { id: 'sw-html', title: 'Web Development Basics', provider: 'SWAYAM', skills: ['html', 'css', 'javascript'], url: 'https://swayam.gov.in/' },
  { id: 'np-sql', title: 'Database Management with SQL', provider: 'NPTEL', skills: ['sql', 'databases'], url: 'https://nptel.ac.in/' },
  { id: 'co-react', title: 'React for Beginners', provider: 'Coursera', skills: ['react', 'javascript'], url: 'https://www.coursera.org/' },
  { id: 'np-stats', title: 'Intro to Statistics', provider: 'NPTEL', skills: ['statistics'], url: 'https://nptel.ac.in/' },
  { id: 'co-excel', title: 'Excel Skills for Business', provider: 'Coursera', skills: ['excel'], url: 'https://www.coursera.org/' },
  { id: 'in-wireframe', title: 'Wireframing 101', provider: 'Internal', skills: ['wireframing'], url: '#' },
  { id: 'in-research', title: 'User Research Basics', provider: 'Internal', skills: ['research', 'communication'], url: '#' },
];

const SkillGap: React.FC = () => {
  const { user } = useAuth();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(ROLES[0].id);
  const [plan, setPlan] = useState<string[]>([]);

  const studentSkills = (user?.skills || []).map(s => s.toLowerCase());
  const role = ROLES.find(r => r.id === selectedRoleId)!;

  const gaps = useMemo(() => {
    const req = role.requiredSkills.map(s => s.toLowerCase());
    return req.filter(s => !studentSkills.includes(s));
  }, [role, studentSkills.join(',')]);

  const recommendations = useMemo(() => {
    if (gaps.length === 0) return [] as Course[];
    return COURSES
      .map(c => ({ course: c, hit: c.skills.reduce((a, s) => a + (gaps.includes(s.toLowerCase()) ? 1 : 0), 0) }))
      .filter(x => x.hit > 0)
      .sort((a, b) => b.hit - a.hit)
      .map(x => x.course)
      .slice(0, 8);
  }, [gaps.join(',')]);

  useEffect(() => {
    try { setPlan(JSON.parse(localStorage.getItem('skillPlan') || '[]')); } catch {}
  }, []);

  const addToPlan = (courseId: string) => {
    const next = Array.from(new Set([...(plan || []), courseId]));
    setPlan(next);
    localStorage.setItem('skillPlan', JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Skill Gap & Micro-Certs</h1>
              <p className="text-gray-600">Identify gaps for your target role and add courses to your learning plan.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Target Role:</label>
            <select value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)} className="px-3 py-2 border rounded-lg">
              {ROLES.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Skills */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Skills</h2>
          {studentSkills.length === 0 ? (
            <p className="text-gray-600 text-sm">Add skills to your profile to get better recommendations.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {studentSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Gaps */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Gaps for “{role.title}”</h2>
          {gaps.length === 0 ? (
            <div className="text-emerald-700 text-sm inline-flex items-center"><Lightbulb className="h-4 w-4 mr-1"/>No gaps detected. Great job!</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {gaps.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-100">{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Plan */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Your Learning Plan</h2>
            <ClipboardList className="h-5 w-5 text-gray-500"/>
          </div>
          {plan.length === 0 ? (
            <p className="text-gray-600 text-sm">Add courses to build your plan.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {plan.map(cid => {
                const c = COURSES.find(x => x.id === cid);
                if (!c) return null;
                return (
                  <li key={cid} className="flex items-center justify-between border rounded-lg p-2">
                    <span>{c.title} <span className="text-xs text-gray-500">({c.provider})</span></span>
                    <a href={c.url} target="_blank" className="text-blue-600 text-xs underline">Open</a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recommended Micro-Certifications</h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-600 text-sm">No gaps detected or no matching courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(c => (
              <div key={c.id} className="border rounded-xl bg-white p-4 shadow-sm">
                <div className="text-gray-900 font-medium">{c.title}</div>
                <div className="text-xs text-gray-600 mb-2">Provider: {c.provider}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {c.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a href={c.url} target="_blank" className="text-blue-600 text-sm underline">View</a>
                  <button onClick={() => addToPlan(c.id)} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 inline-flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-1"/> Add to Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
