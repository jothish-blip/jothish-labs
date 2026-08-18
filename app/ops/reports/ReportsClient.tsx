'use client';

import { Download, FileText, Calendar, ShieldAlert, Activity, Users, Box, Mail, Fingerprint } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

type ReportData = {
  generatedAt: string;
  daily: {
    visitors: number;
    uniqueVisitors: number;
  };
  weekly: {
    failedLogins: number;
    blockedIPs: number;
  };
  monthly: {
    totalSessions: number;
  };
  contacts: Record<string, number>;
  topProjects: { name: string; views: number }[];
  resumeDownloads: number;
};

export default function ReportsClient({ reportData }: { reportData: ReportData }) {
  const [downloading, setDownloading] = useState(false);

  const exportToCSV = () => {
    setDownloading(true);
    try {
      const rows = [
        ['SOC Intelligence Report', 'Generated:', format(new Date(reportData.generatedAt), 'yyyy-MM-dd HH:mm:ss')],
        [],
        ['--- 24H VISITOR SUMMARY ---'],
        ['Total Sessions (24h)', reportData.daily.visitors],
        ['Unique Visitors (24h)', reportData.daily.uniqueVisitors],
        [],
        ['--- 7D SECURITY SUMMARY ---'],
        ['Failed Logins (7d)', reportData.weekly.failedLogins],
        ['Blocked IPs (7d)', reportData.weekly.blockedIPs],
        [],
        ['--- 30D ANALYTICS ---'],
        ['Total Sessions (30d)', reportData.monthly.totalSessions],
        ['Total Resume Downloads (All-Time)', reportData.resumeDownloads],
        [],
        ['--- CONTACT STATISTICS ---'],
        ...Object.entries(reportData.contacts).map(([key, value]) => [key, value]),
        [],
        ['--- TOP PROJECTS ---'],
        ...reportData.topProjects.map((p, i) => [`#${i + 1} ${p.name}`, p.views])
      ];

      const csvContent = rows.map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `soc_report_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export CSV', e);
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <header className="mb-10 border-b border-surface pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Intelligence Reports
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase flex items-center gap-2">
            <Calendar size={14} /> Generated {format(new Date(reportData.generatedAt), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={downloading}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
        >
          <Download size={14} /> {downloading ? 'Exporting...' : 'Export CSV'}
        </button>
      </header>

      <div className="bg-background border border-surface rounded-sm p-8 shadow-2xl">
        <div className="text-center border-b border-surface pb-8 mb-8">
           <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
           <h2 className="text-xl font-mono uppercase tracking-[0.2em] text-foreground">Executive SOC Summary</h2>
           <p className="text-xs font-mono uppercase tracking-widest text-muted mt-2">Classified Internal Use Only</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Daily & Monthly Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-surface/50 pb-2">
                <Users size={12} className="text-emerald-500" /> Daily Visitor Report (24H)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Total Sessions</span>
                  <span className="text-foreground">{reportData.daily.visitors}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Unique Fingerprints</span>
                  <span className="text-foreground">{reportData.daily.uniqueVisitors}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-surface/50 pb-2">
                <Activity size={12} className="text-blue-500" /> Monthly Analytics (30D)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Total Portfolio Sessions</span>
                  <span className="text-foreground">{reportData.monthly.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Total Resume Downloads</span>
                  <span className="text-foreground">{reportData.resumeDownloads}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Contacts Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-surface/50 pb-2">
                <ShieldAlert size={12} className="text-[#E4002B]" /> Security Summary (7D)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Failed Authentication Attempts</span>
                  <span className={reportData.weekly.failedLogins > 0 ? "text-[#E4002B]" : "text-emerald-500"}>{reportData.weekly.failedLogins}</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-muted">Suspicious IPs Blocked</span>
                  <span className="text-foreground">{reportData.weekly.blockedIPs}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-surface/50 pb-2">
                <Mail size={12} className="text-amber-500" /> Contact Statistics
              </h3>
              <div className="space-y-3">
                {Object.entries(reportData.contacts).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center font-mono text-xs">
                    <span className="text-muted uppercase">{key}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Top Projects Full Width */}
        <div className="mt-12 pt-8 border-t border-surface border-dashed">
          <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Box size={12} className="text-purple-500" /> Top Performing Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
             {reportData.topProjects.map((p, i) => (
               <div key={p.name} className="flex justify-between items-center font-mono text-xs">
                 <span className="text-muted truncate mr-4">{i + 1}. {p.name}</span>
                 <span className="text-foreground whitespace-nowrap">{p.views} views</span>
               </div>
             ))}
             {reportData.topProjects.length === 0 && (
               <p className="text-xs font-mono text-muted italic">No project data available.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
