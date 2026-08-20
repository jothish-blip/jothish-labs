'use client';

import { Download, FileText, Calendar, ShieldAlert, Activity, Users, Box, Mail, File as FileIcon, MapPin, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


type ReportData = {
  generatedAt: string;
  daily: { visitors: number; uniqueVisitors: number };
  weekly: { failedLogins: number; blockedIPs: number };
  monthly: { totalSessions: number };
  contacts: Record<string, number>;
  topProjects: { name: string; views: number }[];
  resumeDownloads: number;
  locationData: { name: string; count: number }[];
  deviceData: { name: string; count: number }[];
};

export default function ReportsClient({ reportData, trafficData }: { reportData: ReportData, trafficData: { name: string, visitors: number, sessions: number }[] }) {
  const [downloading, setDownloading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF' | 'EXCEL'>('CSV');
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#6366f1'];

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      try {
        if (exportFormat === 'CSV') exportCSV();
        else if (exportFormat === 'PDF') exportPDF();
        else if (exportFormat === 'EXCEL') exportExcel();
      } catch (e) {
        console.error('Export failed', e);
      }
      setDownloading(false);
    }, 500);
  };

  const exportCSV = () => {
    const rows = [
      ['SOC Intelligence Report', 'Generated:', format(new Date(reportData.generatedAt), 'yyyy-MM-dd HH:mm:ss')],
      [],
      ['Total Sessions (24h)', reportData.daily.visitors],
      ['Unique Visitors (24h)', reportData.daily.uniqueVisitors],
      ['Failed Logins (7d)', reportData.weekly.failedLogins],
      ['Total Sessions (30d)', reportData.monthly.totalSessions],
      ['Resume Downloads', reportData.resumeDownloads]
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `soc_report_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('SOC Intelligence Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(reportData.generatedAt), 'yyyy-MM-dd HH:mm:ss')}`, 14, 30);
    
    autoTable(doc, {
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Sessions (24h)', reportData.daily.visitors.toString()],
        ['Unique Visitors (24h)', reportData.daily.uniqueVisitors.toString()],
        ['Failed Logins (7d)', reportData.weekly.failedLogins.toString()],
        ['Total Sessions (30d)', reportData.monthly.totalSessions.toString()],
        ['Resume Downloads', reportData.resumeDownloads.toString()],
      ],
    });
    
    doc.save(`soc_report_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
  };

  const exportExcel = () => {
    const ws_data = [
      ['Metric', 'Value'],
      ['Total Sessions (24h)', reportData.daily.visitors],
      ['Unique Visitors (24h)', reportData.daily.uniqueVisitors],
      ['Failed Logins (7d)', reportData.weekly.failedLogins],
      ['Total Sessions (30d)', reportData.monthly.totalSessions],
      ['Resume Downloads', reportData.resumeDownloads]
    ];
    
    const csvContent = ws_data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `soc_report_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      <header className="mb-10 border-b border-surface pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight uppercase text-foreground">
            Intelligence Reports
          </h1>
          <p className="text-muted text-sm font-mono mt-2 tracking-widest uppercase flex items-center gap-2">
            <Calendar size={14} /> Generated {format(new Date(reportData.generatedAt), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value as 'CSV' | 'PDF' | 'EXCEL')}
            className="bg-surface/50 border border-surface rounded-sm px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
          >
            <option value="CSV">CSV Format</option>
            <option value="PDF">PDF Document</option>
            <option value="EXCEL">Excel Spreadsheet</option>
          </select>
          <button 
            onClick={handleExport}
            disabled={downloading}
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Download size={14} /> {downloading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </header>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
        <div className="xl:col-span-2 bg-background border border-surface p-6 rounded-sm shadow-sm">
           <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Activity size={12} className="text-emerald-500" /> Traffic Overview (7D)
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={trafficData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                 <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-background border border-surface p-6 rounded-sm shadow-sm">
           <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Box size={12} className="text-purple-500" /> Project Engagement
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={reportData.topProjects.slice(0, 5)}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                 <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                 <Bar dataKey="views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-background border border-surface p-6 rounded-sm shadow-sm">
           <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Monitor size={12} className="text-amber-500" /> System / Device
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={reportData.deviceData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="count"
                 >
                   {reportData.deviceData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-4 mt-2 flex-wrap">
             {reportData.deviceData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-1 text-[9px] font-mono uppercase text-muted">
                 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span> {d.name}
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Location & Executive Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background border border-surface rounded-sm p-8 shadow-sm">
            <h3 className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <MapPin size={12} className="text-blue-500" /> Location Demographics
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background border border-surface rounded-sm p-8 shadow-sm">
            <div className="text-center border-b border-surface pb-8 mb-8">
               <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
               <h2 className="text-xl font-mono uppercase tracking-[0.2em] text-foreground">Executive SOC Summary</h2>
               <p className="text-xs font-mono uppercase tracking-widest text-muted mt-2">Classified Internal Use Only</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
          </div>
        </div>

      </div>
    </div>
  );
}
