import  { useEffect, useState } from "react";
import { Mail, ShieldAlert, X, AlertTriangle, User, Calendar, ZoomIn } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000";

// Define the shape of the Report data coming from the backend
interface Report {
  id: number;
  description: string;
  created_at: string;
  reporter_email: string;
  reporter_name?: string;
  reported_influencer: string;
  images: string[];
}

const fetchReports = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/api/admin/reports`, {
    headers: { Authorization: token }
  });
  return res.data;
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // State for the full-screen image viewer
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading case files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl shadow-sm">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Incident Reports</h1>
            <p className="text-sm text-slate-500 mt-1">Review, moderate, and resolve platform complaints.</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg shadow-sm text-center">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active</span>
          <span className="block text-xl font-bold text-slate-800">{reports.length}</span>
        </div>
      </div>

      {/* Reports Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-24 text-center">Case ID</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Reported Subject</th>
                <th className="px-6 py-4">Date Filed</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr 
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 text-center">
                      #{report.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {report.reporter_email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        <User size={12} />
                        {report.reported_influencer}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(report.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      Review Case &rarr;
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldAlert size={32} className="mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-600">No active reports</p>
                      <p className="text-sm">The platform is currently clear of complaints.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900 leading-tight">
                    Case File #{selectedReport.id.toString().padStart(4, '0')}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Filed on {new Date(selectedReport.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Submitted By</span>
                  <p className="text-sm font-medium text-slate-800 break-all">
                    {selectedReport.reporter_email}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 block">Reported Subject</span>
                  <p className="text-sm font-bold text-red-700">
                    {selectedReport.reported_influencer}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Incident Description</span>
                <div className="text-sm text-slate-700 bg-white p-5 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                  {selectedReport.description}
                </div>
              </div>

              {/* Evidence Images */}
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Attached Evidence ({selectedReport.images.length})</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {selectedReport.images.map((img: string, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => setEnlargedImage(img)}
                        className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden cursor-pointer group shadow-sm hover:ring-2 hover:ring-slate-900 transition-all"
                      >
                        <img 
                          src={img} 
                          alt={`Evidence ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 flex items-center justify-center transition-all">
                          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 gap-3">
              <button 
                onClick={() => setSelectedReport(null)} 
                className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-sm"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Overlay */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setEnlargedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setEnlargedImage(null);
            }}
          >
            <X size={32} />
          </button>
          
          <img 
            src={enlargedImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent clicks on the image from closing the overlay
          />
        </div>
      )}
    </div>
  );
};

export default Reports;