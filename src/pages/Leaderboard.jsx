import { useMemo } from "react";
import { Trophy, Medal, Star, Info } from "lucide-react";
import { useIssues } from "../hooks/useIssues";

const MOCK_LEADERBOARD = [
  { id: 1, name: "Rahul S.", points: 340 },
  { id: 2, name: "Priya M.", points: 290 },
  { id: 3, name: "Amit K.", points: 210 },
  { id: 4, name: "Sneha V.", points: 185 },
  { id: 5, name: "Vikram R.", points: 150 },
  { id: 6, name: "Anjali D.", points: 120 },
  { id: 7, name: "Rohan J.", points: 95 },
  { id: 8, name: "Neha C.", points: 80 },
  { id: 9, name: "Karan T.", points: 65 },
];

export default function Leaderboard() {
  const { issues } = useIssues();
  const userPoints = useMemo(() => issues.length * 10, [issues]);

  const isHero = userPoints > 50;

  // Mix user into leaderboard
  const combined = [...MOCK_LEADERBOARD, { id: 'me', name: "You (Current User)", points: userPoints }]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="min-h-screen pt-[58px] relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-14">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2 justify-center flex items-center gap-1.5"><Trophy size={14} className="text-amber" /> Citizen Rankings</p>
          <h1 className="text-[36px] font-black tracking-tightest leading-tight mb-3">
            Community Leaderboard
          </h1>
          <p className="text-[14px] text-white/40 leading-relaxed max-w-lg mx-auto">
            Earn points by reporting and verifying issues. Top contributors unlock the Community Hero badge!
          </p>
        </div>

        {/* User Stats Card */}
        <div className="glass rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: "rgba(99,102,241,0.05)", border: "0.5px solid rgba(99,102,241,0.2)" }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
              {isHero ? <Medal size={28} className="text-amber drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" /> : <Star size={28} className="text-white/30" />}
            </div>
            <div>
              <p className="text-[12px] text-white/50 mb-1">Your Contribution Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-black tracking-tighter text-white">{userPoints}</span>
                <span className="text-[13px] font-bold text-violet-light tracking-wide">PTS</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
             {isHero ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "rgba(251,191,36,0.1)", border: "0.5px solid rgba(251,191,36,0.3)" }}>
                  <Star size={16} className="text-amber fill-amber" />
                  <div>
                    <p className="text-[12px] font-bold text-amber">Community Hero</p>
                    <p className="text-[10px] text-amber/70">Badge unlocked!</p>
                  </div>
                </div>
             ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <Info size={16} className="text-white/30" />
                  <div>
                    <p className="text-[12px] font-bold text-white/60">Novice Citizen</p>
                    <p className="text-[10px] text-white/40">Earn {51 - userPoints} more pts for Hero badge</p>
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 text-[11px] font-bold text-white/40 uppercase tracking-wider border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-7">Citizen</div>
            <div className="col-span-3 text-right">Points</div>
          </div>
          <div className="flex flex-col">
            {combined.slice(0, 10).map((u) => (
              <div 
                key={u.id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 transition-colors ${u.id === 'me' ? 'bg-violet-900/20' : 'hover:bg-white/[0.02]'}`}
                style={{ borderColor: "rgba(255,255,255,0.03)" }}
              >
                <div className="col-span-2 text-center font-mono font-bold">
                  {u.rank === 1 ? <span className="text-amber inline-block">1st</span> : 
                   u.rank === 2 ? <span className="text-slate-300 inline-block">2nd</span> : 
                   u.rank === 3 ? <span className="text-amber-700 inline-block">3rd</span> : 
                   <span className="text-white/40">{u.rank}</span>}
                </div>
                <div className="col-span-7 font-bold text-[14px] flex items-center gap-2">
                  {u.name}
                  {u.points > 50 && <Star size={12} className="text-amber fill-amber drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />}
                </div>
                <div className="col-span-3 text-right font-mono text-[14px] font-bold text-violet-light">
                  {u.points}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
