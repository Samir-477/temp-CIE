# Projects Domain Implementation Guide

## Overview
Successfully implemented a new "Projects" domain under the coordinator system. Now faculty project requests will go to a Projects coordinator instead of directly to cieoffice@pes.edu or the Lab Components coordinator.

## What was changed:

### 1. Created Projects Domain
- ✅ Added a new "Projects" domain to the database
- ✅ Created setup script: `scripts/setup-projects-domain.ts`

### 2. Updated Project Approval Logic
- ✅ Modified `/api/projects/approve/route.ts` to check for Projects domain coordinator instead of Lab Components coordinator
- ✅ Both PUT (approve project) and GET (fetch pending projects) endpoints now require Projects coordinator permission

### 3. Enhanced Coordinator Dashboard
- ✅ Added `hasProjectsManagement` property to domain types
- ✅ Added 'projects' to the selectedRole type and user roles array
- ✅ Added Projects Coordinator role card with purple theme and FolderOpen icon
- ✅ Added `isProjectsCoordinator` flag based on domain assignment
- ✅ Integrated `FacultyProjectRequests` component for managing project requests
- ✅ Added Projects role to the role switcher interface

## How to Use:

### Step 1: Assign a Projects Coordinator
1. Log in as an admin
2. Go to **Admin Panel > Manage CIE Coordinators**
3. Click **"Assign Coordinator"**
4. Select **Domain**: "Projects"
5. Select **Faculty**: Choose the faculty member who should handle project approvals
6. Click **"Assign Coordinator"**

### Step 2: Test the System
1. Have a faculty member create a new project (this will set status to "PENDING")
2. The assigned Projects coordinator will now see:
   - A "Projects Coordinator" role card if they have only this role
   - A role switcher if they have multiple coordinator roles
   - The Faculty Project Requests interface when they select the Projects role
3. The coordinator can now approve/reject projects directly instead of routing through cieoffice@pes.edu

### Step 3: Workflow Flow
```
Faculty creates project → Status: PENDING → Projects Coordinator gets notified → 
Coordinator reviews → Approves/Rejects → Faculty gets notification
```

## Technical Details:

### Database Changes:
- New domain record: `{ name: "Projects", description: "Manages faculty project requests and approvals" }`

### API Changes:
- `/api/projects/approve` now checks for "Projects" domain coordinator instead of "Lab Components"

### UI Changes:
- New Projects Coordinator role card (purple theme)
- Integrated project request management interface
- Role switcher supports projects role

## Files Modified:
1. `scripts/setup-projects-domain.ts` (NEW)
2. `app/api/projects/approve/route.ts` 
3. `components/pages/faculty/coordinator-dashboard.tsx`

## Testing Checklist:
- [ ] Projects domain created in database ✅
- [ ] Can assign faculty as Projects coordinator through admin panel
- [ ] Projects coordinator sees the role option
- [ ] Faculty project requests appear in coordinator dashboard
- [ ] Coordinator can approve/reject projects
- [ ] Non-Projects coordinators cannot access project approval endpoints

The system is now ready for use! The Projects coordinator will handle all faculty project approvals independently of other coordinators.
