# Time Registration App - Implementation Plan

**Version:** 1.0  
**Date:** January 14, 2026  
**Based on:** Requirements.md v1.0

---

## Overview

This implementation plan breaks down the Time Registration App development into **8 phases**, starting with project setup and mock data implementation, then progressively adding real connectors. The plan follows a **mock-first strategy** to enable rapid UI/UX development without backend dependencies.

**Total Estimated Duration:** 6-8 weeks (depending on team size and part-time/full-time allocation)

---

## Development Approach

### Mock-First Strategy
1. **Phase 1-4**: Build complete app with mock data (4-5 weeks)
2. **Phase 5-6**: Connect real Office 365 and SQL (1-2 weeks)
3. **Phase 7**: Connect LS Central Custom API (1 week)
4. **Phase 8**: Testing and deployment (1 week)

### Key Principles
- ✅ **Service Interface Pattern**: All data operations behind interfaces
- ✅ **UI-first**: Complete UI/UX before real connectors
- ✅ **Incremental Integration**: Add one connector at a time
- ✅ **Zero UI Changes**: Service swap doesn't affect UI code
- ✅ **Continuous Testing**: Test after each phase

---

## Phase 1: Project Setup & Foundation (3-4 days)

### 1.1 Initialize Power Apps Code App Project

**Tasks:**
- [ ] Create React + TypeScript + Vite project
  ```bash
  npm create vite@latest TimeRegistration -- --template react-ts
  cd TimeRegistration
  npm install
  ```
- [ ] Install Power Platform SDK
  ```bash
  npm install --save-dev "@pa-client/power-code-sdk@https://github.com/microsoft/PowerAppsCodeApps/releases/download/v0.0.2/6-18-pa-client-power-code-sdk-0.0.1.tgz"
  ```
- [ ] Configure `tsconfig.app.json`: Set `verbatimModuleSyntax: false`
- [ ] Update `vite.config.ts`: Set port 3000, base path "./"
- [ ] Update `package.json` scripts:
  ```json
  "dev": "start pac code run && vite",
  "build": "tsc -b && vite build"
  ```

**Deliverables:**
- ✅ Running Vite dev server on port 3000
- ✅ Power Apps SDK configured
- ✅ TypeScript compilation working

### 1.2 Install Fluent UI v9

**Tasks:**
- [ ] Install Fluent UI packages
  ```bash
  npm install @fluentui/react-components @fluentui/react-icons
  npm install --save-dev @types/node
  ```
- [ ] Downgrade to React 18 (required for Fluent v9)
  ```bash
  npm install react@18 react-dom@18
  ```
- [ ] Create `PowerProvider.tsx` wrapper
- [ ] Update `main.tsx` with PowerProvider and FluentProvider

**Deliverables:**
- ✅ Fluent UI v9 installed and configured
- ✅ Theme provider setup (light/dark support)
- ✅ Basic app shell renders

### 1.3 Project Structure Setup

**Tasks:**
- [ ] Create folder structure:
  ```
  src/
  ├── components/
  ├── pages/
  │   ├── employee/
  │   └── manager/
  ├── services/
  ├── hooks/
  ├── mockData/
  ├── types/
  └── utils/
  ```
- [ ] Create placeholder files for all components
- [ ] Setup React Router for navigation
- [ ] Create base layout component

**Deliverables:**
- ✅ Complete folder structure
- ✅ Navigation working between routes
- ✅ Layout with header/sidebar

### 1.4 TypeScript Interfaces

**Tasks:**
- [ ] Create `types/TimeEntry.ts`
  ```typescript
  interface TimeEntry {
    id: number;
    bcId?: string;
    employeeNo: string;
    workLocation: string;
    workRoleCode?: string;
    systemDateEntry: string;
    systemTimeEntry: string;
    systemDateExit?: string;
    systemTimeExit?: string;
    userDateEntry?: string;
    userTimeEntry?: string;
    userDateExit?: string;
    userTimeExit?: string;
    noOfHours?: number;
    status: 'Pending' | 'Approved' | 'Synced' | 'SyncFailed' | 'Rejected';
    bcStatus?: string;
    retryFlag: boolean;
    syncErrorMessage?: string;
    managerId?: string;
    approvalComment?: string;
    createdAt: string;
    updatedAt: string;
  }
  ```
- [ ] Create `types/WorkLocation.ts`
- [ ] Create `types/User.ts` (Office 365 user format)
- [ ] Create `types/ServiceResult.ts` for API responses

**Deliverables:**
- ✅ All TypeScript interfaces defined
- ✅ Type safety across project

---

## Phase 2: Mock Services & Data Layer (4-5 days)

### 2.1 Service Interfaces

**Tasks:**
- [ ] Create `services/ITimeEntryService.ts`
  ```typescript
  interface ITimeEntryService {
    checkIn(employeeNo: string, location: string): Promise<ServiceResult<TimeEntry>>;
    checkOut(employeeNo: string): Promise<ServiceResult<TimeEntry>>;
    getEmployeeEntries(employeeNo: string, dateRange?: DateRange): Promise<ServiceResult<TimeEntry[]>>;
    getAllEntries(date: Date, pagination?: PaginationParams): Promise<ServiceResult<PagedResult<TimeEntry>>>;
    updateEntry(id: number, data: Partial<TimeEntry>): Promise<ServiceResult<TimeEntry>>;
    approveEntry(id: number, managerId: string, comment?: string): Promise<ServiceResult<void>>;
    bulkApprove(ids: number[], managerId: string, comment?: string): Promise<ServiceResult<BulkResult>>;
    retrySync(id: number): Promise<ServiceResult<void>>;
  }
  ```
- [ ] Create `services/ILocationService.ts`
- [ ] Create `services/IUserService.ts`

**Deliverables:**
- ✅ Service interfaces with TypeScript contracts
- ✅ ServiceResult wrapper type

### 2.2 Mock Data Generation

**Tasks:**
- [ ] Create `mockData/office365Data.ts`
  - 20+ realistic user profiles (names, emails, departments, photos)
  - Current user mock
- [ ] Create `mockData/workLocationsData.ts`
  - 10+ locations matching LS Central structure
  - Include all fields: code, description, workRegion, storeNo, etc.
- [ ] Create `mockData/timeEntriesData.ts`
  - 50+ time entries with various statuses
  - Mix of checked in/out, pending, approved, synced, failed
  - Edge cases: duplicate check-ins, overlapping times

**Deliverables:**
- ✅ Realistic mock data for development
- ✅ Edge cases covered for validation testing

### 2.3 Mock Service Implementation

**Tasks:**
- [ ] Create `services/MockUserService.ts`
  - Implement `getCurrentUser()` returning mock O365 user
  - Add simulated delay (100-300ms)
- [ ] Create `services/MockLocationService.ts`
  - Implement `syncLocations()` returning mock locations
  - Implement `getLocations()` with filtering support
  - Simulate API delay
- [ ] Create `services/MockTimeEntryService.ts`
  - Implement all ITimeEntryService methods
  - Use in-memory array to store entries
  - Validate check-in constraints (one active per employee)
  - Calculate hours automatically
  - Simulate async delays
  - Return proper error responses for validation failures

**Deliverables:**
- ✅ All mock services fully functional
- ✅ Validation logic working
- ✅ Realistic delays simulating API calls

### 2.4 Service Factory

**Tasks:**
- [ ] Create `services/ServiceFactory.ts`
  ```typescript
  class ServiceFactory {
    private static useMock = true; // Toggle for mock vs real
    
    static getTimeEntryService(): ITimeEntryService {
      return this.useMock ? new MockTimeEntryService() : new SqlTimeEntryService();
    }
    
    static getLocationService(): ILocationService {
      return this.useMock ? new MockLocationService() : new CustomApiLocationService();
    }
    
    static getUserService(): IUserService {
      return this.useMock ? new MockUserService() : new Office365UserService();
    }
  }
  ```

**Deliverables:**
- ✅ Service factory for easy mock/real swapping
- ✅ Single toggle to switch between modes

---

## Phase 3: Employee Interface (5-6 days)

### 3.1 Time Entries Page (Check-In/Out)

**Tasks:**
- [ ] Create `pages/employee/TimeEntriesPage.tsx`
- [ ] Implement check-in flow:
  - Fetch locations from LocationService
  - Dropdown with location selection
  - "Check In" button (primary, large)
  - Call TimeEntryService.checkIn()
  - Show success toast notification
- [ ] Implement check-out flow:
  - "Check Out" button visible when checked in
  - Call TimeEntryService.checkOut()
  - Calculate and display hours worked
- [ ] Create `components/TimeTrackingDashboard.tsx`:
  - Large elapsed time display (e.g., "5h 23m")
  - Update every second using `useElapsedTime` hook
  - Circular or linear progress indicator
  - Check-in timestamp
  - Expected end time (check-in + 8 hours)
  - Remaining time display
- [ ] Add status badge (Checked In/Out)
- [ ] 30-second auto-refresh

**Deliverables:**
- ✅ Functional check-in/out interface
- ✅ Real-time elapsed time dashboard
- ✅ Location selection working
- ✅ Auto-refresh mechanism

### 3.2 User Profile Page

**Tasks:**
- [ ] Create `pages/employee/UserProfilePage.tsx`
- [ ] Fetch current user from UserService
- [ ] Display:
  - User photo (Office 365 avatar)
  - Display name
  - Email (EmployeeNo)
  - Job title
- [ ] Use Fluent UI Avatar and Card components
- [ ] Handle loading and error states

**Deliverables:**
- ✅ Profile page with Office 365 user data
- ✅ Responsive card layout

### 3.3 History Page

**Tasks:**
- [ ] Create `pages/employee/HistoryPage.tsx`
- [ ] Implement filters:
  - Date range picker (default: last 30 days)
  - Status dropdown (All/Pending/Approved/Synced)
- [ ] Create `components/TimeEntryDataGrid.tsx` for employee view:
  - Columns: Date, Location, Check-In, Check-Out, Hours, Status
  - Fluent UI DataGrid with server-side pagination
  - Sortable columns
  - Status badge rendering
- [ ] Implement pagination:
  - 50 entries per page
  - Previous/Next buttons
  - Page size selector (25/50/100)
- [ ] 30-second auto-refresh
- [ ] Loading skeleton during fetch
- [ ] Empty state: "No entries found"

**Deliverables:**
- ✅ History page with DataGrid
- ✅ Filtering and pagination working
- ✅ Auto-refresh enabled

### 3.4 Employee Navigation

**Tasks:**
- [ ] Create three-tab layout using Fluent UI Tabs
- [ ] Tab 1: Time Entries (check-in/out + dashboard)
- [ ] Tab 2: User Profile
- [ ] Tab 3: History
- [ ] Mobile responsive: tabs stack vertically on small screens

**Deliverables:**
- ✅ Complete employee interface with three tabs
- ✅ Mobile responsive layout

---

## Phase 4: Manager Interface (6-7 days)

### 4.1 Approval Dashboard Layout

**Tasks:**
- [ ] Create `pages/manager/ApprovalDashboard.tsx`
- [ ] Create header section:
  - Fluent UI Calendar component (date picker)
  - Selected date display
  - Entry count badge
  - Manual refresh button
  - Status filter dropdown
  - Employee search input
- [ ] Create toolbar section:
  - "Bulk Approve" button (disabled if no selection)
  - "Show Only Failed" toggle
  - Export button (placeholder)

**Deliverables:**
- ✅ Dashboard layout with calendar and toolbar
- ✅ Filters functional

### 4.2 Manager DataGrid

**Tasks:**
- [ ] Create enhanced `components/TimeEntryDataGrid.tsx` for manager:
  - Checkbox column (multi-select, sticky)
  - Employee name (fetched from UserService)
  - Location description
  - Check-In (date + time)
  - Check-Out (date + time)
  - Hours (decimal, right-aligned)
  - Status (badge with color coding)
  - Actions column (Edit/Approve/Reject/Retry buttons)
- [ ] Implement column resizing with columnSizingOptions
- [ ] Server-side sorting (click headers)
- [ ] Server-side pagination (50 per page)
- [ ] Row selection with multi-select checkboxes
- [ ] Status badge styling:
  - Pending: warning (yellow)
  - Approved: brand (blue)
  - Synced: success (green)
  - SyncFailed: danger (red)
- [ ] Highlight failed entries with red tint

**Deliverables:**
- ✅ Manager DataGrid with all columns
- ✅ Multi-select working
- ✅ Sortable and resizable columns

### 4.3 Edit Time Dialog

**Tasks:**
- [ ] Create `components/EditTimeDialog.tsx`
- [ ] Dialog fields:
  - User Date Entry (DatePicker)
  - User Time Entry (TimePicker)
  - User Date Exit (DatePicker)
  - User Time Exit (TimePicker)
  - Calculated Hours (read-only, bold)
  - Manager Comment (Textarea, 500 chars)
- [ ] Validation:
  - Exit must be after Entry
  - Real-time hours calculation
- [ ] Pre-populate with System Date/Time if User Date/Time empty
- [ ] Pause auto-refresh when dialog open
- [ ] Resume auto-refresh when dialog closed
- [ ] Call TimeEntryService.updateEntry() on save

**Deliverables:**
- ✅ Edit dialog functional
- ✅ Validation working
- ✅ Auto-refresh pausing

### 4.4 Approval Actions

**Tasks:**
- [ ] Create `components/ApprovalDialog.tsx`:
  - Confirmation dialog for single approval
  - Optional comment field
  - "Approve and Sync" button
- [ ] Create `components/BulkApprovalDialog.tsx`:
  - List of selected entries
  - Single comment for all (optional)
  - Progress bar during processing
  - Result summary (X synced, Y failed)
- [ ] Implement row-level approve:
  - Click checkmark icon
  - Show confirmation dialog
  - Call TimeEntryService.approveEntry()
  - Show toast notification
- [ ] Implement bulk approve:
  - Select multiple rows with checkboxes
  - Click "Bulk Approve" button
  - Show bulk approval dialog
  - Call TimeEntryService.bulkApprove()
  - Display progress and results
- [ ] Implement reject action:
  - Requires rejection comment
  - Updates status to Rejected
- [ ] Implement retry for failed syncs:
  - Only visible for SyncFailed status
  - Call TimeEntryService.retrySync()

**Deliverables:**
- ✅ Single and bulk approval working
- ✅ Reject functionality
- ✅ Retry mechanism for failures

### 4.5 Auto-Refresh & Real-Time Updates

**Tasks:**
- [ ] Create `hooks/useAutoRefresh.ts`:
  - Refreshes data every 30 seconds
  - Accepts pause/resume control
  - Returns loading state
- [ ] Implement in manager dashboard:
  - Auto-refresh entries for selected date
  - Pause during edit dialog
  - Resume after dialog closes
- [ ] Implement in employee history:
  - Auto-refresh personal entries
  - Update elapsed time every second (separate from 30s refresh)

**Deliverables:**
- ✅ Auto-refresh working across all pages
- ✅ Pause/resume mechanism functional

---

## Phase 5: Office 365 Integration (2-3 days)

### 5.1 Setup Office 365 Connector

**Tasks:**
- [ ] Confirm Power Platform environment (First Release)
- [ ] Authenticate to environment:
  ```bash
  pac auth create --environment {environment-id}
  ```
- [ ] Add Office 365 Users connector:
  ```bash
  pac code add-data-source -a "shared_office365users" -c <connectionId>
  ```
- [ ] Verify connector in generated code

**Deliverables:**
- ✅ Office 365 connector configured
- ✅ Power Apps SDK generated code

### 5.2 Implement Office365UserService

**Tasks:**
- [ ] Create `services/Office365UserService.ts` implementing `IUserService`
- [ ] Replace mock implementation:
  ```typescript
  async getCurrentUser(): Promise<ServiceResult<Office365User>> {
    try {
      const result = await Office365UsersService.MyProfile();
      if (result.data) {
        return { success: true, data: result.data };
      }
      return { success: false, errorMessage: 'Failed to load profile' };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
  ```
- [ ] Implement photo loading:
  ```typescript
  async getUserPhoto(userId: string): Promise<string | null> {
    const result = await Office365UsersService.UserPhoto(userId);
    if (result.data) {
      return `data:image/jpeg;base64,${result.data}`;
    }
    return null;
  }
  ```
- [ ] Update ServiceFactory to use Office365UserService
- [ ] Test authentication flow

**Deliverables:**
- ✅ Real Office 365 authentication working
- ✅ User profile displays real data
- ✅ User photos loading

### 5.3 Update Employee No Mapping

**Tasks:**
- [ ] Update check-in logic to use Office 365 email as EmployeeNo
- [ ] Verify email format matches LS Central employee codes
- [ ] Add error handling if user not found in LS Central

**Deliverables:**
- ✅ Office 365 user ID used as EmployeeNo
- ✅ Error handling for unmapped users

---

## Phase 6: SQL Database Integration (3-4 days)

### 6.1 Setup SQL Database

**Tasks:**
- [ ] Create SQL Server database (Azure SQL or on-premises)
- [ ] Run DDL scripts to create tables:
  - TimeEntries table (from Requirements.md schema)
  - WorkLocations table (from Requirements.md schema)
- [ ] Create indexes:
  ```sql
  CREATE INDEX IX_TimeEntries_EmployeeNo ON TimeEntries(EmployeeNo);
  CREATE INDEX IX_TimeEntries_Status ON TimeEntries(Status);
  CREATE INDEX IX_TimeEntries_SystemDateEntry ON TimeEntries(SystemDateEntry);
  CREATE UNIQUE INDEX UQ_ActiveCheckIn ON TimeEntries(EmployeeNo, SystemDateExit, SystemTimeExit) 
    WHERE SystemDateExit IS NULL AND SystemTimeExit IS NULL;
  ```
- [ ] Verify database connectivity

**Deliverables:**
- ✅ SQL database provisioned
- ✅ Tables and indexes created
- ✅ Unique constraint enforced

### 6.2 Setup SQL Connector

**Tasks:**
- [ ] Get SQL connection ID:
  ```bash
  pac connection list
  ```
- [ ] Add SQL data source with TimeEntries table:
  ```bash
  pac code add-data-source -a "shared_sql" -c <connectionId> \
    -t "dbo.TimeEntries" -d "server.database.windows.net,database"
  ```
- [ ] Add SQL data source with WorkLocations table:
  ```bash
  pac code add-data-source -a "shared_sql" -c <connectionId> \
    -t "dbo.WorkLocations" -d "server.database.windows.net,database"
  ```
- [ ] Verify generated SDK code

**Deliverables:**
- ✅ SQL connector configured
- ✅ Power Apps SDK generated for both tables

### 6.3 Implement SqlTimeEntryService

**Tasks:**
- [ ] Create `services/SqlTimeEntryService.ts` implementing `ITimeEntryService`
- [ ] Implement checkIn():
  - Insert new record with Status='Pending'
  - Handle unique constraint violation (already checked in)
- [ ] Implement checkOut():
  - Query for open entry (SystemDateExit IS NULL)
  - Update with exit time and calculate hours
- [ ] Implement getEmployeeEntries():
  - Query with filtering by EmployeeNo and date range
  - Support pagination
- [ ] Implement getAllEntries():
  - Query all entries for selected date
  - Support pagination and sorting
- [ ] Implement updateEntry():
  - Update UserDateEntry, UserTimeEntry, etc.
  - Recalculate NoOfHours
- [ ] Implement approveEntry():
  - Update Status to 'Approved'
  - Set ManagerId and ApprovalComment
  - TODO: Trigger Custom API sync (placeholder for Phase 7)
- [ ] Implement bulkApprove():
  - Update multiple entries
  - Return per-entry results
- [ ] Implement retrySync():
  - Clear RetryFlag
  - Update Status to 'Approved'
  - TODO: Retry Custom API sync (placeholder for Phase 7)

**Deliverables:**
- ✅ SQL service fully implemented
- ✅ CRUD operations working
- ✅ Pagination and filtering functional

### 6.4 Implement SqlLocationService

**Tasks:**
- [ ] Create `services/SqlLocationService.ts` implementing `ILocationService`
- [ ] Implement getLocations():
  - Query WorkLocations table
  - Filter by Status='Active'
- [ ] Implement syncLocations():
  - TODO: Fetch from Custom API (placeholder for Phase 7)
  - For now, return existing data from SQL

**Deliverables:**
- ✅ SQL location service implemented
- ✅ Locations loading from SQL

### 6.5 Switch to SQL Services

**Tasks:**
- [ ] Update ServiceFactory:
  ```typescript
  static useMock = false; // Switch to real services
  ```
- [ ] Update imports to use SQL services
- [ ] Test all employee workflows with SQL
- [ ] Test all manager workflows with SQL
- [ ] Verify data persistence across sessions

**Deliverables:**
- ✅ App using SQL database
- ✅ All workflows functional with SQL
- ✅ Data persisting correctly

---

## Phase 7: LS Central Custom API Integration (4-5 days)

### 7.1 Setup Custom API Connector

**Tasks:**
- [ ] Get Custom API connection details from admin
- [ ] Add custom API connector:
  ```bash
  pac code add-data-source -a "shared_customapi" -c <connectionId>
  ```
- [ ] Configure authentication (Bearer token)
- [ ] Test API connectivity

**Deliverables:**
- ✅ Custom API connector configured
- ✅ Authentication working

### 7.2 Implement CustomApiLocationService

**Tasks:**
- [ ] Create `services/CustomApiLocationService.ts` implementing `ILocationService`
- [ ] Implement syncLocations():
  ```typescript
  async syncLocations(): Promise<ServiceResult<WorkLocation[]>> {
    try {
      const url = `https://api.businesscentral.dynamics.com/v2.0/${env}/api/lsretail/timeregistration/v2.0/companies(${companyId})/workLocations`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Map OData response to WorkLocation
      const locations = data.value.map(item => ({
        id: item.id,
        code: item.code,
        description: item.description,
        workRegion: item.workRegion,
        storeNo: item.storeNo,
        responsiblePerson: item.responsiblePerson,
        status: item.status,
        globalDimension1Code: item.globalDimension1Code,
        globalDimension2Code: item.globalDimension2Code,
        odataETag: item['@odata.etag'],
        lastSyncedAt: new Date().toISOString()
      }));
      
      // Save to SQL WorkLocations table
      await this.saveToSql(locations);
      
      return { success: true, data: locations };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
  ```
- [ ] Implement saveToSql() to update WorkLocations table
- [ ] Call syncLocations() on app startup

**Deliverables:**
- ✅ Location sync from LS Central working
- ✅ WorkLocations table populated from BC

### 7.3 Implement LS Central Sync in SqlTimeEntryService

**Tasks:**
- [ ] Update approveEntry() to sync to LS Central:
  ```typescript
  async approveEntry(id: number, managerId: string, comment?: string): Promise<ServiceResult<void>> {
    try {
      // 1. Update SQL: Status='Approved'
      await this.updateSql(id, { status: 'Approved', managerId, approvalComment: comment });
      
      // 2. Get entry data
      const entry = await this.getById(id);
      
      // 3. Sync to LS Central
      const bcResult = await this.syncToBusinessCentral(entry);
      
      if (bcResult.success) {
        // 4. Update SQL: Status='Synced', save BC ID
        await this.updateSql(id, { 
          status: 'Synced', 
          bcId: bcResult.data.id,
          bcStatus: bcResult.data.status 
        });
      } else {
        // 4. Update SQL: Status='SyncFailed', save error
        await this.updateSql(id, { 
          status: 'SyncFailed', 
          retryFlag: true,
          syncErrorMessage: bcResult.errorMessage 
        });
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
  ```
- [ ] Implement syncToBusinessCentral():
  ```typescript
  async syncToBusinessCentral(entry: TimeEntry): Promise<ServiceResult<any>> {
    try {
      const url = `https://api.businesscentral.dynamics.com/v2.0/${env}/api/lsretail/timeregistration/v2.0/companies(${companyId})/timeEntryRegistrations`;
      
      const body = {
        employeeNo: entry.employeeNo,
        workLocation: entry.workLocation,
        workRoleCode: entry.workRoleCode || '',
        systemDateEntry: entry.systemDateEntry,
        systemTimeEntry: entry.systemTimeEntry,
        systemDateExit: entry.systemDateExit,
        systemTimeExit: entry.systemTimeExit,
        userDateEntry: entry.userDateEntry || entry.systemDateEntry,
        userTimeEntry: entry.userTimeEntry || entry.systemTimeEntry,
        userDateExit: entry.userDateExit || entry.systemDateExit,
        userTimeExit: entry.userTimeExit || entry.systemTimeExit,
        entryEmployeeComment: entry.approvalComment || '',
        entryMethod: 'Manual Entry',
        originLogon: 'PowerApps'
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const error = await response.json();
        return { success: false, errorMessage: error.error.message };
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error.message };
    }
  }
  ```
- [ ] Update bulkApprove() to call approveEntry() for each entry
- [ ] Update retrySync() to call syncToBusinessCentral() again

**Deliverables:**
- ✅ Approved entries syncing to LS Central
- ✅ BC record ID saved in SQL
- ✅ Error handling and retry working

### 7.4 End-to-End Testing

**Tasks:**
- [ ] Test complete workflow:
  1. Employee checks in → SQL insert
  2. Employee checks out → SQL update
  3. Manager approves → SQL update + BC POST
  4. Verify entry in LS Central table
- [ ] Test error scenarios:
  - Invalid employee number
  - Invalid location code
  - Network failures
  - Retry mechanism
- [ ] Test bulk approval with multiple entries
- [ ] Verify status workflow: Pending → Approved → Synced

**Deliverables:**
- ✅ End-to-end workflow validated
- ✅ Data correctly in both SQL and LS Central
- ✅ Error handling working

---

## Phase 8: Testing, Polish & Deployment (4-5 days)

### 8.1 Comprehensive Testing

**Tasks:**
- [ ] **Unit Tests**:
  - Service layer methods
  - Validation logic (check-in constraints)
  - Hours calculation utilities
  - Date/time formatting utilities
- [ ] **Integration Tests**:
  - Office 365 authentication
  - SQL CRUD operations
  - Custom API sync
  - Auto-refresh mechanism
- [ ] **UI/UX Tests**:
  - Employee check-in/out flow
  - Manager approval workflow
  - Edit time dialog
  - Bulk approval
  - Filters and pagination
  - Mobile responsiveness
- [ ] **Error Handling Tests**:
  - Network failures
  - Invalid data
  - Duplicate check-ins
  - Sync failures and retry

**Deliverables:**
- ✅ All tests passing
- ✅ Edge cases covered

### 8.2 Performance Optimization

**Tasks:**
- [ ] Implement code splitting:
  - Lazy load manager dashboard
  - Lazy load heavy components
- [ ] Optimize DataGrid rendering:
  - Memoize column definitions
  - Virtualization for large lists
- [ ] Optimize auto-refresh:
  - Debounce user actions
  - Cancel pending requests on unmount
- [ ] Bundle size analysis:
  ```bash
  npm run build
  # Analyze bundle size
  ```

**Deliverables:**
- ✅ Page load < 2 seconds
- ✅ DataGrid renders < 500ms
- ✅ Bundle size optimized

### 8.3 Accessibility & Polish

**Tasks:**
- [ ] WCAG 2.1 AA compliance:
  - Add ARIA labels to all interactive elements
  - Keyboard navigation for all actions
  - Focus indicators visible
  - Color contrast minimum 4.5:1
- [ ] Screen reader testing:
  - Status announcements
  - Error messages
  - Form validation feedback
- [ ] Polish UI:
  - Loading states (skeletons)
  - Empty states (friendly messages)
  - Error states (actionable guidance)
  - Success confirmations (toast notifications)

**Deliverables:**
- ✅ WCAG 2.1 AA compliant
- ✅ Screen reader friendly
- ✅ Professional UI polish

### 8.4 Documentation

**Tasks:**
- [ ] Create `README.md`:
  - Project overview
  - Setup instructions
  - Development workflow
  - Deployment steps
- [ ] Create `DEVELOPMENT.md`:
  - Architecture overview
  - Service layer explanation
  - Mock-to-production migration guide
  - Troubleshooting common issues
- [ ] Update `Database_Schema.md` with any changes
- [ ] Document API endpoints and authentication
- [ ] Create user guides:
  - Employee quick start
  - Manager approval guide

**Deliverables:**
- ✅ Complete documentation
- ✅ Developer and user guides

### 8.5 Deployment to Power Platform

**Tasks:**
- [ ] Build production bundle:
  ```bash
  npm run build
  ```
- [ ] Initialize Power Apps configuration:
  ```bash
  pac code init --displayName "Time Registration" -l "./public/vite.svg"
  ```
- [ ] Deploy to Power Platform:
  ```bash
  pac code push
  ```
- [ ] Post-deployment validation:
  - [ ] Office 365 login works
  - [ ] WorkLocations synced from LS Central
  - [ ] Employee can check in/out
  - [ ] TimeEntries saved to SQL
  - [ ] Manager can approve entries
  - [ ] Approved entries sync to LS Central
  - [ ] Verify data in LS Central tables

**Deliverables:**
- ✅ App deployed to Power Platform
- ✅ All features working in production
- ✅ Data flowing correctly

---

## Risk Management

### High Priority Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Office 365 user ID doesn't match LS Central employee code** | High | Map O365 email to BC employee table; add admin mapping interface |
| **Business Central API authentication issues** | High | Test authentication early; have BC admin support ready |
| **SQL unique constraint violations** | Medium | Robust error handling; friendly user messages |
| **Network latency for LS Central sync** | Medium | Implement async sync with status tracking; retry mechanism |
| **Power Platform connector limitations** | High | Test connectors early; have fallback plans |

### Monitoring & Success Metrics

**Key Metrics:**
- [ ] Check-in/out success rate > 99%
- [ ] Approval sync success rate > 95%
- [ ] Average page load time < 2 seconds
- [ ] User satisfaction score > 4/5
- [ ] Zero security vulnerabilities
- [ ] WCAG 2.1 AA compliance 100%

---

## Team & Resources

### Recommended Team

- **Frontend Developer**: 1 FTE - React, TypeScript, Fluent UI v9
- **Backend Developer**: 0.5 FTE - SQL, Power Platform, LS Central integration
- **QA Tester**: 0.5 FTE - Manual and automated testing
- **UX Designer**: 0.25 FTE - UI/UX review and polish
- **Power Platform Admin**: 0.25 FTE - Connector setup, environment management

### Tools & Access Required

- [ ] Power Platform First Release environment
- [ ] Office 365 tenant with admin access
- [ ] Azure SQL Database or SQL Server
- [ ] Business Central environment with LS Central
- [ ] Business Central API credentials
- [ ] Visual Studio Code with extensions
- [ ] Node.js v18+ and npm
- [ ] Power Platform CLI (pac)
- [ ] Git for version control

---

## Timeline Gantt Chart

```
Week 1: Phase 1 (Project Setup) ████
Week 1-2: Phase 2 (Mock Services) ████████
Week 2-3: Phase 3 (Employee UI) ██████████
Week 3-5: Phase 4 (Manager UI) ██████████████
Week 5: Phase 5 (Office 365) ████
Week 6: Phase 6 (SQL) ██████
Week 6-7: Phase 7 (LS Central API) ████████
Week 7-8: Phase 8 (Testing & Deploy) ████████
```

---

## Success Checklist

### Phase 1-4 (Mock Implementation)
- [ ] App runs locally with mock data
- [ ] All employee features working
- [ ] All manager features working
- [ ] Auto-refresh functioning
- [ ] Responsive design on mobile

### Phase 5-6 (Real Data)
- [ ] Office 365 authentication working
- [ ] SQL database operational
- [ ] Data persisting correctly
- [ ] No UI changes required

### Phase 7 (LS Central)
- [ ] WorkLocations syncing from BC
- [ ] Approved entries syncing to BC
- [ ] Retry mechanism working
- [ ] Error handling robust

### Phase 8 (Production)
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Accessibility compliant
- [ ] Deployed to Power Platform
- [ ] End-to-end validation complete

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Confirm resource availability** (team, tools, access)
3. **Set up development environment** (Power Platform, SQL, BC access)
4. **Begin Phase 1** - Project setup and foundation

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-14 | - | Initial implementation plan based on Requirements.md v1.0 |
