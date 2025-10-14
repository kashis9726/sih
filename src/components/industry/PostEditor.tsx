import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { getIllustrationFor } from '../../utils/imageProvider';
import { FileText } from 'lucide-react';

const PostEditor: React.FC = () => {
  const { user } = useAuth();
  const { addPost, updateUserPoints, users } = useApp();
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    stipend: '',
    type: 'Internship' as 'Job' | 'Internship' | 'Freelance' | 'Part-time',
    skills: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user) return alert('Please login.');
    setSaving(true);
    try {
      const author = users.find(u => u.id === user.id) || user;
      const content = [
        form.title ? `${form.title}` : '',
        form.company ? ` @ ${form.company}` : '',
        form.location ? ` • Location: ${form.location}` : '',
        form.type ? ` • ${form.type}` : '',
        form.stipend ? `\nStipend: ${form.stipend}` : '',
        form.skills ? `\nSkills: ${form.skills}` : '',
        form.description ? `\n\n${form.description}` : ''
      ].join('');
      const image = await getIllustrationFor(`${form.title} ${form.company}`);
      addPost({
        authorId: user.id,
        author,
        content,
        likes: [],
        comments: [],
        type: 'job',
        image,
      });
      updateUserPoints(user.id, 20);
      alert('Posting published. Check Opportunities to view it.');
      setForm({ title: '', company: '', location: '', stipend: '', type: 'Internship', skills: '', description: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-amber-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Post Internship / Project</h1>
            <p className="text-gray-600">Create a new opportunity for students to apply.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="px-3 py-2 border rounded-lg" placeholder="Title (e.g., Data Analyst Intern)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <select className="px-3 py-2 border rounded-lg" value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})}>
            <option>Job</option>
            <option>Internship</option>
            <option>Freelance</option>
            <option>Part-time</option>
          </select>
          <input className="px-3 py-2 border rounded-lg" placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
          <input className="px-3 py-2 border rounded-lg" placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
          <input className="px-3 py-2 border rounded-lg" placeholder="Stipend/CTC (e.g., ₹20,000/month)" value={form.stipend} onChange={e=>setForm({...form,stipend:e.target.value})} />
          <input className="px-3 py-2 border rounded-lg" placeholder="Skills (comma-separated)" value={form.skills} onChange={e=>setForm({...form,skills:e.target.value})} />
          <textarea className="md:col-span-2 px-3 py-2 border rounded-lg" rows={5} placeholder="Short description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        </div>
        <div className="mt-4 flex justify-end">
          <button disabled={saving} onClick={submit} className="px-5 py-2 rounded-lg text-white bg-btn-gradient shadow-elev-1 disabled:opacity-50">{saving ? 'Publishing...' : 'Publish'}</button>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
