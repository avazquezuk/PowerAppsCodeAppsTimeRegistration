import { User, TimeRecord, TeamMemberSummary, TeamStatistics } from '../types';

// Mock team members
export const mockTeamMembers: User[] = [
  {
    id: 'user-001',
    displayName: 'John Doe',
    email: 'john.doe@contoso.com',
    department: 'Engineering',
    role: 'employee',
  },
  {
    id: 'user-002',
    displayName: 'Jane Smith',
    email: 'jane.smith@contoso.com',
    department: 'Engineering',
    role: 'employee',
  },
  {
    id: 'user-003',
    displayName: 'Mike Johnson',
    email: 'mike.johnson@contoso.com',
    department: 'Engineering',
    role: 'employee',
  },
  {
    id: 'user-004',
    displayName: 'Emily Brown',
    email: 'emily.brown@contoso.com',
    department: 'Engineering',
    role: 'employee',
  },
  {
    id: 'user-005',
    displayName: 'David Wilson',
    email: 'david.wilson@contoso.com',
    department: 'Engineering',
    role: 'employee',
  },
];

// Helper to get date strings
const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getToday = (): string => new Date().toISOString().split('T')[0];

// Generate mock team time records
export const mockTeamTimeRecords: TimeRecord[] = [
  // Today's records
  {
    id: 'team-rec-001',
    userId: 'user-001',
    userName: 'John Doe',
    checkInTime: `${getToday()}T08:30:00Z`,
    checkOutTime: `${getToday()}T17:15:00Z`,
    location: 'Main Office',
    approvalStatus: 'approved',
    createdAt: `${getToday()}T08:30:00Z`,
    updatedAt: `${getToday()}T17:15:00Z`,
  },
  {
    id: 'team-rec-002',
    userId: 'user-002',
    userName: 'Jane Smith',
    checkInTime: `${getToday()}T09:00:00Z`,
    location: 'Home Office',
    approvalStatus: 'pending',
    createdAt: `${getToday()}T09:00:00Z`,
    updatedAt: `${getToday()}T09:00:00Z`,
  },
  {
    id: 'team-rec-003',
    userId: 'user-003',
    userName: 'Mike Johnson',
    checkInTime: `${getToday()}T08:45:00Z`,
    checkOutTime: `${getToday()}T16:30:00Z`,
    location: 'Main Office',
    approvalStatus: 'pending',
    createdAt: `${getToday()}T08:45:00Z`,
    updatedAt: `${getToday()}T16:30:00Z`,
  },
  {
    id: 'team-rec-004',
    userId: 'user-004',
    userName: 'Emily Brown',
    checkInTime: `${getToday()}T08:15:00Z`,
    location: 'Branch Office',
    approvalStatus: 'pending',
    createdAt: `${getToday()}T08:15:00Z`,
    updatedAt: `${getToday()}T08:15:00Z`,
  },
  // Yesterday's records
  {
    id: 'team-rec-005',
    userId: 'user-001',
    userName: 'John Doe',
    checkInTime: `${getDaysAgo(1)}T08:30:00Z`,
    checkOutTime: `${getDaysAgo(1)}T17:00:00Z`,
    location: 'Main Office',
    approvalStatus: 'approved',
    createdAt: `${getDaysAgo(1)}T08:30:00Z`,
    updatedAt: `${getDaysAgo(1)}T17:00:00Z`,
  },
  {
    id: 'team-rec-006',
    userId: 'user-002',
    userName: 'Jane Smith',
    checkInTime: `${getDaysAgo(1)}T09:00:00Z`,
    checkOutTime: `${getDaysAgo(1)}T18:00:00Z`,
    location: 'Home Office',
    approvalStatus: 'rejected',
    createdAt: `${getDaysAgo(1)}T09:00:00Z`,
    updatedAt: `${getDaysAgo(1)}T18:00:00Z`,
  },
  {
    id: 'team-rec-007',
    userId: 'user-003',
    userName: 'Mike Johnson',
    checkInTime: `${getDaysAgo(1)}T08:45:00Z`,
    checkOutTime: `${getDaysAgo(1)}T17:30:00Z`,
    location: 'Main Office',
    approvalStatus: 'approved',
    createdAt: `${getDaysAgo(1)}T08:45:00Z`,
    updatedAt: `${getDaysAgo(1)}T17:30:00Z`,
  },
  {
    id: 'team-rec-008',
    userId: 'user-004',
    userName: 'Emily Brown',
    checkInTime: `${getDaysAgo(1)}T08:00:00Z`,
    checkOutTime: `${getDaysAgo(1)}T16:45:00Z`,
    location: 'Branch Office',
    approvalStatus: 'sync-failed',
    createdAt: `${getDaysAgo(1)}T08:00:00Z`,
    updatedAt: `${getDaysAgo(1)}T16:45:00Z`,
  },
  {
    id: 'team-rec-009',
    userId: 'user-005',
    userName: 'David Wilson',
    checkInTime: `${getDaysAgo(1)}T09:15:00Z`,
    checkOutTime: `${getDaysAgo(1)}T18:00:00Z`,
    location: 'Remote',
    approvalStatus: 'approved',
    createdAt: `${getDaysAgo(1)}T09:15:00Z`,
    updatedAt: `${getDaysAgo(1)}T18:00:00Z`,
  },
  // 2 days ago
  {
    id: 'team-rec-010',
    userId: 'user-001',
    userName: 'John Doe',
    checkInTime: `${getDaysAgo(2)}T08:30:00Z`,
    checkOutTime: `${getDaysAgo(2)}T17:15:00Z`,
    location: 'Main Office',
    approvalStatus: 'approved',
    createdAt: `${getDaysAgo(2)}T08:30:00Z`,
    updatedAt: `${getDaysAgo(2)}T17:15:00Z`,
  },
  {
    id: 'team-rec-011',
    userId: 'user-002',
    userName: 'Jane Smith',
    checkInTime: `${getDaysAgo(2)}T09:00:00Z`,
    checkOutTime: `${getDaysAgo(2)}T17:30:00Z`,
    location: 'Home Office',
    approvalStatus: 'approved',
    createdAt: `${getDaysAgo(2)}T09:00:00Z`,
    updatedAt: `${getDaysAgo(2)}T17:30:00Z`,
  },
  {
    id: 'team-rec-012',
    userId: 'user-003',
    userName: 'Mike Johnson',
    checkInTime: `${getDaysAgo(2)}T08:45:00Z`,
    checkOutTime: `${getDaysAgo(2)}T16:30:00Z`,
    location: 'Main Office',
    approvalStatus: 'pending',
    createdAt: `${getDaysAgo(2)}T08:45:00Z`,
    updatedAt: `${getDaysAgo(2)}T16:30:00Z`,
  },
];

let teamRecords = [...mockTeamTimeRecords];

export const getAllTeamRecords = (): TimeRecord[] => {
  return [...teamRecords].sort((a, b) => 
    new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  );
};

export const getTeamMemberRecords = (userId: string, days: number = 30): TimeRecord[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return teamRecords
    .filter(r => r.userId === userId && new Date(r.checkInTime) >= cutoffDate)
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
};

export const getTeamRecordsByDate = (days: number = 7): TimeRecord[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return teamRecords
    .filter(r => new Date(r.checkInTime) >= cutoffDate)
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
};

export const calculateTeamStatistics = (): TeamStatistics => {
  const today = getToday();
  const todayRecords = teamRecords.filter(r => r.checkInTime.startsWith(today));
  const currentlyCheckedIn = todayRecords.filter(r => !r.checkOutTime).length;
  
  const todayHours = todayRecords.reduce((sum, r) => {
    const start = new Date(r.checkInTime).getTime();
    const end = r.checkOutTime ? new Date(r.checkOutTime).getTime() : Date.now();
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);
  
  // Calculate week hours (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekRecords = teamRecords.filter(r => new Date(r.checkInTime) >= weekAgo);
  
  const weekHours = weekRecords.reduce((sum, r) => {
    const start = new Date(r.checkInTime).getTime();
    const end = r.checkOutTime ? new Date(r.checkOutTime).getTime() : Date.now();
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);
  
  return {
    totalEmployees: mockTeamMembers.length,
    currentlyCheckedIn,
    todayTotalHours: todayHours,
    weekTotalHours: weekHours,
    averageHoursPerEmployee: mockTeamMembers.length > 0 ? weekHours / mockTeamMembers.length : 0,
  };
};

export const getTeamMemberSummaries = (): TeamMemberSummary[] => {
  const today = getToday();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return mockTeamMembers.map(member => {
    const todayRecords = teamRecords.filter(r => r.userId === member.id && r.checkInTime.startsWith(today));
    const currentRecord = todayRecords.find(r => !r.checkOutTime);
    const weekRecords = teamRecords.filter(r => r.userId === member.id && new Date(r.checkInTime) >= weekAgo);
    
    let todayStatus: 'checked-in' | 'checked-out' | 'not-started' = 'not-started';
    if (todayRecords.length > 0) {
      todayStatus = currentRecord ? 'checked-in' : 'checked-out';
    }
    
    const todayHours = todayRecords.reduce((sum, r) => {
      const start = new Date(r.checkInTime).getTime();
      const end = r.checkOutTime ? new Date(r.checkOutTime).getTime() : Date.now();
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);
    
    const weekHours = weekRecords.reduce((sum, r) => {
      const start = new Date(r.checkInTime).getTime();
      const end = r.checkOutTime ? new Date(r.checkOutTime).getTime() : Date.now();
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);
    
    return {
      user: member,
      todayStatus,
      todayHours,
      weekHours,
      currentLocation: currentRecord?.location,
      lastCheckIn: currentRecord?.checkInTime || todayRecords[0]?.checkInTime,
    };
  });
};
