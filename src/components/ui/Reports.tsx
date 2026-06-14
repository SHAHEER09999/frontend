import { useState } from "react";
import { Mail, ShieldAlert, AlertCircle, X } from "lucide-react";

// Sample mock data matching your exact requested properties
const sampleReports = [
  {
    id: 1,
    reportedBy: "brand_manager@example.com",
    reportedUser: "influencer_prime@example.com",
    reason: "Inappropriate content",
    details: "The user uploaded promotional material that completely violated our strict campaign guidelines and safety standards, despite multiple warnings over email.",
    date: "2026-05-18",
  },
  {
    id: 2,
    reportedBy: "jessica.dev@example.com",
    reportedUser: "bot_account_99@example.com",
    reason: "Spam activity",
    details: "This profile has been sending automated messages containing suspicious external links to dozens of platform users every single hour.",
    date: "2026-05-19",
  },
  {
    id: 3,
    reportedBy: "creator_studio@example.com",
    reportedUser: "fake_brand_co@example.com",
    reason: "Payment fraud / Scammer",
    details: "The brand collected all project deliverables under contract terms but immediately blocked all contact points when the milestone payment was requested.",
    date: "2026-05-20",
  },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<typeof sampleReports[0] | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans antialiased text-slate-800">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Reports</h1>
          <p className="text-sm text-slate-500">Review and moderate complaints submitted by users.</p>
        </div>
      </div>

      {/* Reports Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Reported By</th>
                <th className="px-6 py-4">Offending User</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {sampleReports.map((report) => (
                <tr 
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer group"
                >
                  <td className="px-6 py-4.5 font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {report.reportedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-red-400/80" />
                      <span className="text-red-600 font-medium">{report.reportedUser}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                      <AlertCircle size={12} />
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right text-xs font-medium text-blue-600 group-hover:underline">
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Popup Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} // Keeps click target clean
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <ShieldAlert size={20} className="text-red-500" />
                Report Details
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col gap-5">
              
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Reported By (Reporter)
                </span>
                <p className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  {selectedReport.reportedBy}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Accused User (Target)
                </span>
                <p className="text-sm font-medium text-red-700 bg-red-50/40 px-3 py-2 rounded-lg border border-red-100/60">
                  {selectedReport.reportedUser}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Reason for Incident
                </span>
                <p className="text-sm font-semibold text-amber-800 bg-amber-50/50 px-3 py-2 rounded-lg border border-amber-100/60">
                  {selectedReport.reason}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Detailed Complaint Description
                </span>
                <div className="text-sm leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                  {selectedReport.details}
                </div>
              </div>

            </div>

            {/* Modal Footer actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Dismiss Window
              </button>
              <button 
                onClick={() => {
                  alert(`Taking administration action on: ${selectedReport.reportedUser}`);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Take Action
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;