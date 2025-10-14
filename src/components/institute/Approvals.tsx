import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ShieldCheck, XCircle } from 'lucide-react';

const Approvals: React.FC = () => {
  const { users, setUsers } = useApp();
  const [list, setList] = useState(users);

  useEffect(() => { setList(users); }, [users]);

  const pending = useMemo(() => list.filter(u => u.isVerified === false), [list]);

  const approve = (id: string) => {
    const next = list.map(u => u.id === id ? { ...u, isVerified: true } : u);
    setList(next);
    setUsers(next);
    try {
      const notif = { id: `nt-${Date.now()}`, userId: id, type: 'account_approved', message: 'Your account has been approved by Institute HR.', createdAt: new Date().toISOString(), readAt: null };
      const arr = JSON.parse(localStorage.getItem('notifications') || '[]');
      const out = Array.isArray(arr) ? [notif, ...arr] : [notif];
      localStorage.setItem('notifications', JSON.stringify(out));
    } catch {}
  };

  const reject = (id: string) => {
    const next = list.filter(u => u.id !== id);
    setList(next);
    setUsers(next);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-amber-600"/>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Approvals</h1>
            <p className="text-gray-600">Verify student and alumni accounts.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-elev-1 border border-white/50">
        {pending.length === 0 ? (
          <div className="text-gray-600 text-sm">No pending approvals.</div>
        ) : (
          <div className="space-y-3">
            {pending.map(u => (
              <div key={u.id} className="border rounded-xl bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium">{u.name}</div>
                  <div className="text-xs text-gray-600">{u.email} • {u.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>approve(u.id)} className="px-3 py-1.5 rounded-lg border text-emerald-700 hover:bg-emerald-50">Approve</button>
                  <button onClick={()=>reject(u.id)} className="px-3 py-1.5 rounded-lg border text-red-700 hover:bg-red-50 inline-flex items-center"><XCircle className="h-4 w-4 mr-1"/>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
