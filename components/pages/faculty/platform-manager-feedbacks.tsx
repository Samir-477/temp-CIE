import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import StatusBarChart from "@/components/StatusBarChart";
import { BarChart3, CheckCircle, List, ShieldCheck, Clock, Info, Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Approval",
  APPROVED: "Assigned to Developer",
  IN_PROGRESS: "In Progress",
  DONE: "Awaiting Final Approval",
  COMPLETED: "Completed",
  REJECTED: "Rejected"
};

// Add a helper for image preview
function ImagePreview({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="flex items-center justify-center w-24 h-24 bg-gray-100 border rounded text-gray-400 text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" /></svg>
        No Screenshot
      </div>
    );
  }
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <img src={src} alt="Screenshot" className="h-24 w-24 object-cover rounded border" />
    </a>
  );
}

function ImageCollapse({ src }: { src?: string }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        className="text-xs text-blue-600 underline mb-1 focus:outline-none"
        onClick={() => setOpen(o => !o)}
      >
        {open ? "Hide Screenshot" : "Show Screenshot"}
      </button>
      {open && (
        <a href={src} target="_blank" rel="noopener noreferrer">
          <img src={src} alt="Screenshot" className="h-24 w-24 object-cover rounded border" />
        </a>
      )}
    </div>
  );
}

function ScreenshotLink({ src }: { src?: string }) {
  if (!src) return <span className="text-gray-400 text-xs">No Screenshot</span>;
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View Screenshot</a>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Approval</Badge>;
    case "APPROVED":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Assigned</Badge>;
    case "IN_PROGRESS":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
    case "DONE":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Awaiting Final Approval</Badge>;
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function PlatformManagerFeedbacks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("analytics");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<{ [id: string]: string }>({});
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [historyPage, setHistoryPage] = useState(1);
  const cardsPerPage = 4;
  const historyRowsPerPage = 4;
  const [infoDialogOpen, setInfoDialogOpen] = useState<string | null>(null);
  const [infoDialogImage, setInfoDialogImage] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedbacks", {
        headers: { "x-user-id": user?.id || "" },
      });
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load feedbacks", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    setActionLoading(true);
    try {
      const body: any = { action };
      if (action === "reject" && rejectionReasons[id]) {
        body.rejection_reason = rejectionReasons[id];
      }
      const res = await fetch(`/api/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-user-id": user?.id || "" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchFeedbacks();
        toast({ title: "Success", description: `Feedback ${action}d` });
        setRejectionReasons(prev => ({ ...prev, [id]: "" }));
      } else {
        const err = await res.json();
        throw new Error(err.error);
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update feedback", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  // Tab filters
  const pending = feedbacks.filter(i => i.status === "PENDING");
  const awaitingFinal = feedbacks.filter(i => i.status === "DONE");
  const developerTasks = feedbacks.filter(i => ["APPROVED", "IN_PROGRESS", "DONE"].includes(i.status));
  const history = feedbacks.filter(i => ["COMPLETED", "REJECTED"].includes(i.status));

  // Pagination state for each tab (move below array definitions)
  const [pendingPage, setPendingPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [finalPage, setFinalPage] = useState(1);
  const paginatedPending = pending.slice((pendingPage - 1) * cardsPerPage, pendingPage * cardsPerPage);
  const paginatedTasks = developerTasks.slice((tasksPage - 1) * cardsPerPage, tasksPage * cardsPerPage);
  const paginatedFinal = awaitingFinal.slice((finalPage - 1) * cardsPerPage, finalPage * cardsPerPage);
  const pendingTotalPages = Math.max(1, Math.ceil(pending.length / cardsPerPage));
  const tasksTotalPages = Math.max(1, Math.ceil(developerTasks.length / cardsPerPage));
  const finalTotalPages = Math.max(1, Math.ceil(awaitingFinal.length / cardsPerPage));

  // Filter and paginate history
  const filteredHistory = history.filter(feedback => {
    const matchesSearch =
      historySearchTerm.trim() === "" ||
      feedback.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(historySearchTerm.toLowerCase());
    const matchesStatus =
      historyStatusFilter === "all" || feedback.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyRowsPerPage));
  const paginatedHistory = filteredHistory.slice(
    (historyPage - 1) * historyRowsPerPage,
    historyPage * historyRowsPerPage
  );
  // Reset page if filter/search changes
  useEffect(() => { setHistoryPage(1); }, [historySearchTerm, historyStatusFilter]);

  // Analytics
  const analytics = {
    total: feedbacks.length,
    pending: pending.length,
    completed: history.filter(i => i.status === "COMPLETED").length,
    rejected: history.filter(i => i.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Card-style navigation */}
      <div className="flex flex-row gap-6 justify-center items-center my-6">
        {[ 
          { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'purple' },
          { id: 'pending', label: 'Awaiting Feedback', icon: CheckCircle, color: 'blue' },
          { id: 'tasks', label: 'Tasks Assigned', icon: List, color: 'green' },
          { id: 'final-approval', label: 'Final Approval', icon: ShieldCheck, color: 'indigo' },
          { id: 'history', label: 'History', icon: Clock, color: 'orange' },
        ].map(tabObj => {
          const isActive = tab === tabObj.id;
          const colorClass = isActive
            ? `border-${tabObj.color}-500 bg-${tabObj.color}-50 ring-2 ring-${tabObj.color}-400 text-${tabObj.color}-600`
            : `border-gray-200 hover:border-${tabObj.color}-300 hover:bg-${tabObj.color}-50 bg-white text-gray-800`;
          return (
            <button
              key={tabObj.id}
              className={`flex flex-col items-center justify-center px-8 py-6 rounded-2xl border transition-all duration-200 shadow-sm min-w-[220px] max-w-[260px] h-[110px] text-center select-none ${colorClass}`}
              onClick={() => setTab(tabObj.id)}
            >
              <tabObj.icon className={`h-6 w-6 mb-1 ${isActive ? `text-${tabObj.color}-600` : `text-${tabObj.color}-400`}`} />
              <span className={`text-base font-medium ${isActive ? `text-${tabObj.color}-600` : 'text-gray-800'}`}>{tabObj.label}</span>
            </button>
          );
        })}
      </div>
      {/* Tab content with consistent top margin */}
      <div className="mt-2 ">
        {tab === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Stat Cards Row - like lab/library coordinator */}
              <div className="flex flex-row flex-wrap gap-2 mb-6 justify-center">
                <div className="flex-1 min-w-[100px] max-w-[140px] bg-white rounded shadow-sm px-2 py-1 flex flex-col items-center justify-center text-center border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Total</div>
                  <div className="text-lg font-bold leading-tight">{analytics.total}</div>
                </div>
                <div className="flex-1 min-w-[100px] max-w-[140px] bg-white rounded shadow-sm px-2 py-1 flex flex-col items-center justify-center text-center border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Awaiting Feedback</div>
                  <div className="text-lg font-bold leading-tight">{pending.length}</div>
                </div>
                <div className="flex-1 min-w-[100px] max-w-[140px] bg-white rounded shadow-sm px-2 py-1 flex flex-col items-center justify-center text-center border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Final Approval</div>
                  <div className="text-lg font-bold leading-tight">{awaitingFinal.length}</div>
                </div>
                <div className="flex-1 min-w-[100px] max-w-[140px] bg-white rounded shadow-sm px-2 py-1 flex flex-col items-center justify-center text-center border border-gray-200">
                  <div className="text-xs text-gray-500 font-medium mb-0.5">Completed</div>
                  <div className="text-lg font-bold leading-tight">{analytics.completed}</div>
                </div>
              </div>
              {/* StatusBarChart remains below */}
              <StatusBarChart
                title=""
                data={[
                  { label: 'Pending', count: analytics.pending, color: '#FFC107' },
                  { label: 'Completed', count: analytics.completed, color: '#4CAF50' },
                  { label: 'Rejected', count: analytics.rejected, color: '#F44336' },
                ]}
              />
            </CardContent>
          </Card>
        )}
        {tab === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Awaiting Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : pending.length === 0 ? (
                <div className="text-gray-500">No pending feedbacks.</div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full text-base">
                      <thead>
                        <tr>
                          <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Title</th>
                          <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/8 min-w-[60px]">Category</th>
                          <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/3 min-w-[160px] pl-4">Description</th>
                          <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Image</th>
                          <th className="text-left font-bold text-gray-700 px-8 py-3">Status</th>
                          <th className="text-left font-bold text-gray-700 px-8 py-3">Submitted</th>
                          <th className="text-left font-bold text-gray-700 px-8 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPending.map(feedback => (
                          <tr key={feedback.id} className="border-t text-base">
                            <td className="px-6 py-3 align-top w-1/12 min-w-[40px] font-medium">{feedback.title}</td>
                            <td className="px-6 py-3 align-top w-1/8 min-w-[60px]">{feedback.category}</td>
                            <td className="px-6 py-3 align-top w-1/3 min-w-[160px] pl-4">{feedback.description}</td>
                            <td className="px-6 py-3 align-top w-1/12 min-w-[40px]">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                onClick={() => {
                                  setInfoDialogOpen(feedback.id);
                                  setInfoDialogImage(feedback.image || null);
                                }}
                                aria-label="View Screenshot"
                              >
                                <Info className="h-5 w-5" />
                              </Button>
                            </td>
                            <td className="px-8 py-3 align-top">{getStatusBadge(feedback.status)}</td>
                            <td className="px-8 py-3 align-top">{new Date(feedback.created_at).toLocaleDateString()}</td>
                            <td className="px-8 py-3 align-top">
                              <div className="flex flex-row items-center gap-2">
                                <Button size="sm" className="px-3 py-1" disabled={actionLoading} onClick={() => handleAction(feedback.id, "approve")}>Approve</Button>
                                <Button size="sm" className="px-3 py-1" variant="destructive" disabled={actionLoading} onClick={() => handleAction(feedback.id, "reject")}>Reject</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                      <Button size="sm" variant="outline" onClick={() => setPendingPage(p => Math.max(1, p - 1))} disabled={pendingPage === 1}>Previous</Button>
                      <span className="text-xs text-gray-600">Page {pendingPage} of {pendingTotalPages}</span>
                      <Button size="sm" variant="outline" onClick={() => setPendingPage(p => Math.min(pendingTotalPages, p + 1))} disabled={pendingPage === pendingTotalPages}>Next</Button>
                    </div>
                  </div>
                  <Dialog open={!!infoDialogOpen} onOpenChange={open => { if (!open) { setInfoDialogOpen(null); setInfoDialogImage(null); } }}>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Screenshot</DialogTitle>
                        <DialogDescription>Submitted screenshot for this feedback (if any)</DialogDescription>
                      </DialogHeader>
                      {infoDialogImage ? (
                        <img src={infoDialogImage} alt="Screenshot" className="w-full max-h-[400px] object-contain rounded border" />
                      ) : (
                        <div className="flex items-center justify-center h-40 text-gray-400">No screenshot available</div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>
        )}
        {tab === "final-approval" && (
          <Card>
            <CardHeader>
              <CardTitle>Final Approval (Developer Marked as Done)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div>Loading...</div> : awaitingFinal.length === 0 ? <div className="text-gray-500">No tasks awaiting final approval.</div> : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                  <table className="min-w-full text-base">
                    <thead>
                      <tr>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Title</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/8 min-w-[60px]">Category</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/3 min-w-[160px] pl-4">Description</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Image</th>
                        <th className="text-left font-bold text-gray-700 px-8 py-3">Status</th>
                        <th className="text-left font-bold text-gray-700 px-8 py-3">Submitted</th>
                        <th className="text-left font-bold text-gray-700 px-8 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFinal.map(feedback => (
                        <tr key={feedback.id} className="border-t text-base">
                          <td className="px-6 py-3 align-top w-1/12 min-w-[40px] font-medium">{feedback.title}</td>
                          <td className="px-6 py-3 align-top w-1/8 min-w-[60px]">{feedback.category}</td>
                          <td className="px-6 py-3 align-top w-1/3 min-w-[160px] pl-4">{feedback.description}</td>
                          <td className="px-6 py-3 align-top w-1/12 min-w-[40px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setInfoDialogOpen(feedback.id);
                                setInfoDialogImage(feedback.image || null);
                              }}
                              aria-label="View Screenshot"
                            >
                              <Info className="h-5 w-5" />
                            </Button>
                          </td>
                          <td className="px-8 py-3 align-top">
                            {getStatusBadge(feedback.status)}
                          </td>
                          <td className="px-8 py-3 align-top">{new Date(feedback.created_at).toLocaleDateString()}</td>
                          <td className="px-8 py-3 align-top">
                            <div className="flex flex-col items-start gap-2 min-w-[180px]">
                              <div className="flex flex-row gap-2 w-full">
                                <Button size="sm" className="px-3 py-1 w-28" disabled={actionLoading} onClick={() => handleAction(feedback.id, "complete")}>Approve</Button>
                                <Button size="sm" className="px-3 py-1 w-28" variant="destructive" disabled={actionLoading} onClick={() => handleAction(feedback.id, "reject")}>Reject</Button>
                              </div>
                              <Input
                                placeholder="Rejection reason"
                                value={rejectionReasons[feedback.id] || ""}
                                onChange={e => setRejectionReasons(prev => ({ ...prev, [feedback.id]: e.target.value }))}
                                className="w-full mt-1"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between items-center mt-4">
                    <Button size="sm" variant="outline" onClick={() => setFinalPage(p => Math.max(1, p - 1))} disabled={finalPage === 1}>Previous</Button>
                    <span className="text-xs text-gray-600">Page {finalPage} of {finalTotalPages}</span>
                    <Button size="sm" variant="outline" onClick={() => setFinalPage(p => Math.min(finalTotalPages, p + 1))} disabled={finalPage === finalTotalPages}>Next</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {tab === "tasks" && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div>Loading...</div> : developerTasks.length === 0 ? <div className="text-gray-500 ">No tasks available for developers.</div> : (
                <div className="overflow-x-auto rounded-lg  ">
                  <table className="min-w-full text-base">
                    <thead>
                      <tr>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Title</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/8 min-w-[60px]">Category</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/3 min-w-[160px] pl-4">Description</th>
                        <th className="text-left font-bold text-gray-700 px-6 py-3 w-1/12 min-w-[40px]">Image</th>
                        <th className="text-left font-bold text-gray-700 px-8 py-3">Status</th>
                        <th className="text-left font-bold text-gray-700 px-8 py-3">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTasks.map(feedback => (
                        <tr key={feedback.id} className="border-t text-base">
                          <td className="px-6 py-3 align-top w-1/12 min-w-[40px] font-medium">{feedback.title}</td>
                          <td className="px-6 py-3 align-top w-1/8 min-w-[60px]">{feedback.category}</td>
                          <td className="px-6 py-3 align-top w-1/3 min-w-[160px] pl-4">{feedback.description}</td>
                          <td className="px-6 py-3 align-top w-1/12 min-w-[40px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setInfoDialogOpen(feedback.id);
                                setInfoDialogImage(feedback.image || null);
                              }}
                              aria-label="View Screenshot"
                            >
                              <Info className="h-5 w-5" />
                            </Button>
                          </td>
                          <td className="px-8 py-3 align-top">
                            {getStatusBadge(feedback.status)}
                          </td>
                          <td className="px-8 py-3 align-top">{new Date(feedback.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between items-center mt-4">
                    <Button size="sm" variant="outline" onClick={() => setTasksPage(p => Math.max(1, p - 1))} disabled={tasksPage === 1}>Previous</Button>
                    <span className="text-xs text-gray-600">Page {tasksPage} of {tasksTotalPages}</span>
                    <Button size="sm" variant="outline" onClick={() => setTasksPage(p => Math.min(tasksTotalPages, p + 1))} disabled={tasksPage === tasksTotalPages}>Next</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {tab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and filter controls */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title or description..."
                    value={historySearchTerm || ''}
                    onChange={e => setHistorySearchTerm(e.target.value)}
                    className="max-w-sm pl-8"
                  />
                </div>
                <div className="relative flex items-center">
                  <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    className="border rounded px-8 py-1 text-sm appearance-none"
                    value={historyStatusFilter || 'all'}
                    onChange={e => setHistoryStatusFilter(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  >
                    <option value="all">All</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full text-base">
                  <thead>
                    <tr>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Title</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Category</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Description</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Image</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Status</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Date</th>
                      <th className="text-left font-bold text-gray-700 px-6 py-3">Rejection Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-400">No history found.</td>
                      </tr>
                    ) : (
                      paginatedHistory.map((feedback) => (
                        <tr key={feedback.id} className="border-t text-base">
                          <td className="px-6 py-3 align-top font-medium text-sm truncate">{feedback.title}</td>
                          <td className="px-6 py-3 align-top text-sm truncate">{feedback.category}</td>
                          <td className="px-6 py-3 align-top text-sm whitespace-normal break-words max-w-xs">{feedback.description}</td>
                          <td className="px-6 py-3 align-top">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setInfoDialogOpen(feedback.id + "-image");
                                setInfoDialogImage(feedback.image || null);
                              }}
                              aria-label="View Screenshot"
                            >
                              <Info className="h-5 w-5" />
                            </Button>
                          </td>
                          <td className="px-6 py-3 align-top text-sm">
                            {getStatusBadge(feedback.status)}
                          </td>
                          <td className="px-6 py-3 align-top text-sm whitespace-nowrap">{new Date(feedback.updated_at || feedback.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-3 align-top text-sm text-red-600">{feedback.status === 'REJECTED' && feedback.rejection_reason ? feedback.rejection_reason : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-2 border-t bg-gray-50">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-600">
                    Page {historyPage} of {historyTotalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                    onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                    disabled={historyPage === historyTotalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={!!infoDialogOpen} onOpenChange={open => { if (!open) { setInfoDialogOpen(null); setInfoDialogImage(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Screenshot</DialogTitle>
            <DialogDescription>Submitted screenshot for this feedback (if any)</DialogDescription>
          </DialogHeader>
          {infoDialogImage ? (
            <img src={infoDialogImage} alt="Screenshot" className="w-full max-h-[400px] object-contain rounded border" />
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400">No screenshot available</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 