"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

function getUserId() {
  return window.localStorage.getItem('userId') || '';
}

export default function FacultyInternshipDashboard() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<{ [key: string]: any[] }>({});
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    const res = await fetch('/api/internships/available', {
      headers: { 'x-user-id': getUserId() }
    });
    const data = await res.json();
    const userId = getUserId();
    setInternships((data.internships || []).filter((i: any) => i.facultyId === userId));
    setLoading(false);
  };

  const acceptProject = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/internships/${id}/accept`, {
      method: 'POST',
      headers: { 'x-user-id': getUserId() },
    });
    setLoading(false);
    if (res.ok) {
      toast({ title: 'Project accepted!' });
      fetchInternships();
    } else {
      const err = await res.json();
      toast({ title: 'Error', description: err.error || 'Failed to accept', variant: 'destructive' });
    }
  };

  const fetchApplicants = async (internshipId: string) => {
    const res = await fetch(`/api/internships/${internshipId}/applicants`, {
      headers: { 'x-user-id': getUserId() },
    });
    const data = await res.json();
    setApplicants(prev => ({ ...prev, [internshipId]: data.applications || [] }));
  };

  const updateStatus = async (applicationId: string, status: string, internshipId: string) => {
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': getUserId() },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast({ title: `Application ${status.toLowerCase()}` });
      fetchApplicants(internshipId);
    } else {
      const err = await res.json();
      toast({ title: 'Error', description: err.error || 'Failed to update', variant: 'destructive' });
    }
  };

  const openApplicantsModal = async (internshipId: string) => {
    setSelectedInternshipId(internshipId);
    await fetchApplicants(internshipId);
    setShowApplicantsModal(true);
  };
  const closeApplicantsModal = () => {
    setShowApplicantsModal(false);
    setSelectedInternshipId(null);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">My Internship Projects</h2>
      {loading && <div>Loading...</div>}
      {!loading && internships.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <span className="text-lg text-gray-500 font-medium">No internships assigned yet.</span>
        </div>
      )}
      {!loading && internships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-0 m-0">
          {internships.map((internship) => (
            <Card key={internship.id} className="p-4 flex flex-col md:flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{internship.title}</h3>
                <div className="text-sm text-gray-600 mb-1">Duration: {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : '-'} to {internship.endDate ? new Date(internship.endDate).toLocaleDateString() : '-'}</div>
                <div className="text-sm">Slots: {internship.slots ?? '-'}</div>
              </div>
              <div className="flex gap-2 items-center">
                <Button variant="outline" onClick={() => openApplicantsModal(internship.id)}>View Applicants</Button>
                {!internship.isAccepted && (
                  <Button onClick={() => acceptProject(internship.id)}>Accept Project</Button>
                )}
                {internship.isAccepted && (
                  <div className="text-green-600 font-semibold">Accepted</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showApplicantsModal} onOpenChange={closeApplicantsModal}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Applicants</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(selectedInternshipId && applicants[selectedInternshipId]?.length > 0) ? (
              applicants[selectedInternshipId].map((applicant: any) => (
                <div key={applicant.id} className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div><b>Name:</b> {applicant.student?.name || 'N/A'}</div>
                    <div><b>Email:</b> {applicant.student?.email || 'N/A'}</div>
                    <div><b>Status:</b> {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1).toLowerCase()}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {applicant.resumeUrl && (
                      <Button variant="secondary" onClick={() => window.open(applicant.resumeUrl, '_blank')}>View Resume</Button>
                    )}
                    <Button
                      variant="success"
                      disabled={applicant.status === 'ACCEPTED' || applicant.status === 'REJECTED'}
                      onClick={() => updateStatus(applicant.id, 'ACCEPTED', selectedInternshipId)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={applicant.status === 'ACCEPTED' || applicant.status === 'REJECTED'}
                      onClick={() => updateStatus(applicant.id, 'REJECTED', selectedInternshipId)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>No applicants yet.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeApplicantsModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 