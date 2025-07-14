"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export default function InternshipCreateForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const [faculties, setFaculties] = useState<{id: string, name: string}[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: [''],
    facultyId: '',
    duration: '',
    slots: '',
    startDate: '',
    endDate: '',
    uploadDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [descriptionPdf, setDescriptionPdf] = useState<File | null>(null);
  const [descriptionPdfUrl, setDescriptionPdfUrl] = useState<string>(initialData?.descriptionPdfUrl || '');
  // Track form validity
  const isFormValid =
    form.title.trim() &&
    form.description.trim() &&
    form.skills.every(s => s.trim()) &&
    form.facultyId &&
    form.duration.trim() &&
    form.startDate &&
    form.endDate &&
    form.slots &&
    Number.isInteger(Number(form.slots)) &&
    Number(form.slots) > 0;

  // Track if form has changed from initialData (for edit mode)
  const isFormChanged = useMemo(() => {
    if (!initialData) return true;
    // Compare all fields
    return (
      form.title !== (initialData.title || '') ||
      form.description !== (initialData.description || '') ||
      JSON.stringify(form.skills) !== JSON.stringify(initialData.skills && initialData.skills.length > 0 ? initialData.skills : ['']) ||
      form.facultyId !== (initialData.facultyId || '') ||
      form.duration !== (initialData.duration || '') ||
      form.slots !== (initialData.slots ? String(initialData.slots) : '') ||
      form.startDate !== (initialData.startDate ? initialData.startDate.slice(0, 10) : '') ||
      form.endDate !== (initialData.endDate ? initialData.endDate.slice(0, 10) : '') ||
      form.uploadDescription !== (initialData.uploadDescription || '')
    );
  }, [form, initialData]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        skills: initialData.skills && initialData.skills.length > 0 ? initialData.skills : [''],
        facultyId: initialData.facultyId || '',
        duration: initialData.duration || '',
        slots: initialData.slots ? String(initialData.slots) : '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : '',
        uploadDescription: initialData.uploadDescription || '',
      });
      setDescriptionPdfUrl(initialData.descriptionPdfUrl || '');
    }
  }, [initialData]);

  useEffect(() => {
    fetch('/api/users?role=FACULTY')
      .then(res => res.json())
      .then(data => {
        setFaculties(data.users || []);
        console.log('Loaded faculties:', data.users);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (idx: number, value: string) => {
    const newSkills = [...form.skills];
    newSkills[idx] = value;
    setForm({ ...form, skills: newSkills });
  };

  const addSkill = () => setForm({ ...form, skills: [...form.skills, ''] });
  const removeSkill = (idx: number) => setForm({ ...form, skills: form.skills.filter((_, i) => i !== idx) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDescriptionPdf(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check for userId in localStorage
    const userId = window.localStorage.getItem('userId');
    if (!userId) {
      toast({ title: 'User not logged in. Please login to continue.', variant: 'destructive' });
      return;
    }
    // Validate slots is a positive integer
    const slotsNum = Number(form.slots);
    if (!Number.isInteger(slotsNum) || slotsNum <= 0) {
      toast({ title: 'Slots must be a positive integer', variant: 'destructive' });
      return;
    }
    setLoading(true);
    let pdfUrl = descriptionPdfUrl;
    if (descriptionPdf) {
      const fd = new FormData();
      fd.append('file', descriptionPdf);
      fd.append('type', 'description');
      const uploadRes = await fetch('/api/upload-resume', { method: 'POST', body: fd });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        pdfUrl = uploadData.url;
        setDescriptionPdfUrl(pdfUrl);
      } else {
        toast({ title: 'PDF upload failed', variant: 'destructive' });
        setLoading(false);
        return;
      }
    }
    try {
      let res, data;
      if (initialData && initialData.id) {
        // Edit mode: update internship
        res = await fetch(`/api/internships/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            ...form,
            skills: form.skills.filter(s => s.trim()),
            slots: slotsNum,
            descriptionPdfUrl: pdfUrl,
          }),
        });
        data = await res.json();
        setLoading(false);
        if (res.ok) {
          toast({ title: 'Internship updated!' });
          if (onSuccess) onSuccess();
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to update internship', variant: 'destructive' });
        }
      } else {
        // Create mode: create internship
        res = await fetch('/api/internships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            ...form,
            skills: form.skills.filter(s => s.trim()),
            slots: slotsNum,
            descriptionPdfUrl: pdfUrl,
          }),
        });
        data = await res.json();
        setLoading(false);
        if (res.ok) {
          toast({ title: 'Internship created!' });
          setForm({ title: '', description: '', duration: '', skills: [''], facultyId: '', slots: '', startDate: '', endDate: '',uploadDescription:'' });
          setDescriptionPdf(null);
          setDescriptionPdfUrl('');
          if (onSuccess) onSuccess();
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to create internship', variant: 'destructive' });
        }
      }
    } catch (err) {
      setLoading(false);
      toast({ title: 'Error', description: (err instanceof Error ? err.message : String(err)) || 'Failed to save internship', variant: 'destructive' });
      console.error('Internship save error:', err);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded">
      <form onSubmit={handleSubmit} className="space-y-2 w-full mx-auto">
        <div className="flex gap-8 w-full">
          {/* Left column: all fields except skills */}
          <div className="w-1/2 space-y-2">
            <div>
              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <Label>Description PDF (optional)</Label>
              <Input name="descriptionPdf" type="file" accept="application/pdf" onChange={handleFileChange} />
              {descriptionPdfUrl && (
                <a href={descriptionPdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline ml-2">View uploaded PDF</a>
              )}
            </div>
            <div>
              <Label>Faculty In Charge</Label>
              <Select value={form.facultyId} onValueChange={v => setForm({ ...form, facultyId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty In Charge" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration</Label>
              <Input name="duration" value={form.duration} onChange={handleChange} required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Start Date</Label>
                <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <Label>End Date</Label>
                <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label>Slots</Label>
              <Input name="slots" type="number" value={form.slots} onChange={handleChange} min={1} required />
            </div>
            <Button type="submit" disabled={loading || !isFormValid || (initialData && !isFormChanged)}>{loading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Internship')}</Button>
          </div>
          {/* Right column: skills only */}
          <div className="w-1/2 space-y-2">
            <div>
              <Label>Skills</Label>
              {form.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <Input className="flex-1" value={skill} onChange={e => handleSkillChange(idx, e.target.value)} required />
                  {form.skills.length > 1 && (
                    <Button type="button" variant="outline" onClick={() => removeSkill(idx)}>-</Button>
                  )}
                  {idx === form.skills.length - 1 && (
                    <Button type="button" variant="outline" onClick={addSkill}>+</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 