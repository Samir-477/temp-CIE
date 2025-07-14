"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import InternshipCreateForm from './InternshipCreateForm';
import { Trash2, Edit } from 'lucide-react';

export default function AdminInternshipManager() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInternship, setEditInternship] = useState<any>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/internships');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setInternships(data.internships || []);
    } catch (e) {
      setInternships([]);
      toast({ title: 'Failed to load internships', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleFormSuccess = () => {
    setModalOpen(false);
    fetchInternships();
  };

  const handleDeleteInternship = async (internshipId: string) => {
    try {
      const userId = window.localStorage.getItem('userId');
      if (!userId) {
        toast({ title: 'User not logged in', variant: 'destructive' });
        return;
      }

      const res = await fetch(`/api/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });

      if (res.ok) {
        toast({ title: 'Internship deleted successfully' });
        fetchInternships();
      } else {
        const error = await res.json();
        toast({ title: 'Error', description: (error.error || 'Failed to delete internship') + (error.details ? `\n${error.details}` : ''), variant: 'destructive' });
        console.error('Delete internship error:', error);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete internship', variant: 'destructive' });
    }
  };

  // Optionally, check for admin role here if you have user context

  return (
    <div className="w-full pl-8 pr-6 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Internships</h2>
        <Button onClick={() => setModalOpen(true)}>New Internship</Button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && internships.length === 0 && <div>No internships found.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {internships.map((internship) => (
          <Card key={internship.id} className="p-6 flex flex-col justify-between h-full min-h-[280px]">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{internship.title}</h3>
              <div className="text-sm text-gray-600 mb-1">Faculty In Charge: {internship.facultyName || 'N/A'}</div>
              <div className="text-sm mb-1">Duration: {internship.duration}</div>
              <div className="text-sm mb-1">Slots: {internship.slots ?? '-'}</div>
              <div className="text-sm mb-1">Start: {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : '-'}</div>
              <div className="text-sm mb-1">End: {internship.endDate ? new Date(internship.endDate).toLocaleDateString() : '-'}</div>
              <div className="text-sm mb-3">Status: {internship.isAccepted ? 'Accepted' : 'Pending'}</div>
            </div>
            
            <div className="mt-auto flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Internship</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{internship.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteInternship(internship.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => { setEditInternship(internship); setEditModalOpen(true); }}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl w-1/2">
          <DialogHeader>
            <DialogTitle>Create Internship</DialogTitle>
          </DialogHeader>
          <InternshipCreateForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-3xl w-1/2">
          <DialogHeader>
            <DialogTitle>Edit Internship</DialogTitle>
          </DialogHeader>
          {editInternship && (
            <InternshipCreateForm onSuccess={() => { setEditModalOpen(false); fetchInternships(); }} initialData={editInternship} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 