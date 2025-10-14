import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { FileText, Sparkles, Download, Search, Briefcase } from 'lucide-react';

const AIRecommender: React.FC = () => {
  const { user } = useAuth();
  const { posts } = useApp();
  const [resume, setResume] = useState<string>('');

  const skills = (user?.skills || []).map(s => s.toLowerCase());

  const recommended = useMemo(() => {
    return posts
      .filter(p => p.type === 'job')
      .map(p => ({
        post: p,
        score: skills.reduce((acc, s) => acc + (p.content.toLowerCase().includes(s) ? 1 : 0), 0)
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [posts, skills.join(',')]);

  const generateResume = () => {
    const lines: string[] = [];
    lines.push(`# ${user?.name || 'Student Name'}`);
    lines.push(`${user?.email || ''}`);
    if (user?.department || user?.graduationYear) {
      lines.push(`${user?.department || ''}${user?.department && user?.graduationYear ? ' • ' : ''}${user?.graduationYear || ''}`);
    }
    lines.push('');
    if (user?.bio) {
      lines.push('Summary:');
      lines.push(user.bio);
      lines.push('');
    }
    if (user?.skills && user.skills.length) {
      lines.push('Skills:');
      lines.push(`- ${user.skills.join(', ')}`);
      lines.push('');
    }
    if (user?.startup) {
      lines.push('Projects:');
      lines.push(`- ${user.startup} — Student project/startup`);
      lines.push('');
    }
    lines.push('Achievements:');
    lines.push('- Hackathons / Events / Certifications (add yours)');
    lines.push('');
    lines.push('Links:');
    lines.push('- GitHub: <add link>');
    lines.push('- Portfolio: <add link>');

    const txt = lines.join('\n');
    setResume(txt);
  };

  const downloadTxt = () => {
    const blob = new Blob([resume || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name?.replace(/\s+/g, '_') || 'resume'}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">AI Resume & Recommendations</h1>
              <p className="text-gray-600">Draft a resume and discover internships that match your skills.</p>
            </div>
          </div>
          <button onClick={generateResume} className="px-4 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1 inline-flex items-center">
            <FileText className="h-4 w-4 mr-2"/> Generate Resume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Draft */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Resume Draft</h2>
            <button onClick={downloadTxt} disabled={!resume} className="px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50 inline-flex items-center disabled:opacity-50">
              <Download className="h-4 w-4 mr-2"/> Download (.txt)
            </button>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={16}
            placeholder="Click Generate Resume to create a draft."
            className="w-full p-3 border rounded-xl font-mono text-sm"
          />
        </div>

        {/* Recommendations */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600"/>
              <h2 className="text-lg font-semibold text-gray-900">Recommended Internships</h2>
            </div>
            <span className="text-sm text-gray-600">by skill match</span>
          </div>

          {recommended.length === 0 && (
            <p className="text-gray-600 text-sm">No matches yet. Add skills to your profile to improve recommendations.</p>
          )}

          <div className="space-y-4">
            {recommended.map(({ post, score }) => {
              const header = post.content.split('\n')[0] || post.content.slice(0, 80);
              return (
                <div key={post.id} className="p-4 rounded-xl border bg-white shadow-sm flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Briefcase className="h-4 w-4"/>
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>Match score: <b>{score}</b></span>
                    </div>
                    <div className="text-gray-900 font-medium">{header}</div>
                  </div>
                  <button
                    className="ml-3 px-3 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50"
                    onClick={() => window.dispatchEvent(new CustomEvent('app:navigate' as any, { detail: { page: 'opportunities' } }))}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommender;
