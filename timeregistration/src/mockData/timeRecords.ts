import { TimeRecord, User } from '../types';

export const mockCurrentUser: User = {
  id: 'user-001',
  displayName: 'John Doe',
  email: 'john.doe@contoso.com',
  department: 'Engineering',
  role: 'employee',
};

// Helper to get today's date string
const getToday = (): string => new Date().toISOString().split('T')[0];

// Helper to get a date string for N days ago
const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Generate mock time records for the past week
export const mockTimeRecords: TimeRecord[] = [
  // Yesterday - completed shift
  {
    id: 'rec-001',
    userId: mockCurrentUser.id,
    userName: mockCurrentUser.displayName,
    checkInTime: `${getDaysAgo(1)}T08:30:00Z`,
    checkOutTime: `${getDaysAgo(1)}T17:15:00Z`,
    location: 'Main Office',
    createdAt: `${getDaysAgo(1)}T08:30:00Z`,
    updatedAt: `${getDaysAgo(1)}T17:15:00Z`,
  },
  // 2 days ago - completed shift
  {
    id: 'rec-002',
    userId: mockCurrentUser.id,
    userName: mockCurrentUser.displayName,
    checkInTime: `${getDaysAgo(2)}T09:00:00Z`,
    checkOutTime: `${getDaysAgo(2)}T18:00:00Z`,
    location: 'Main Office',
    createdAt: `${getDaysAgo(2)}T09:00:00Z`,
    updatedAt: `${getDaysAgo(2)}T18:00:00Z`,
  },
  // 3 days ago - completed shift
  {
    id: 'rec-003',
    userId: mockCurrentUser.id,
    userName: mockCurrentUser.displayName,
    checkInTime: `${getDaysAgo(3)}T08:45:00Z`,
    checkOutTime: `${getDaysAgo(3)}T16:30:00Z`,
    location: 'Main Office',
    notes: 'Left early for appointment',
    createdAt: `${getDaysAgo(3)}T08:45:00Z`,
    updatedAt: `${getDaysAgo(3)}T16:30:00Z`,
  },
  // 4 days ago - completed shift
  {
    id: 'rec-004',
    userId: mockCurrentUser.id,
    userName: mockCurrentUser.displayName,
    checkInTime: `${getDaysAgo(4)}T08:30:00Z`,
    checkOutTime: `${getDaysAgo(4)}T17:30:00Z`,
    location: 'Main Office',
    createdAt: `${getDaysAgo(4)}T08:30:00Z`,
    updatedAt: `${getDaysAgo(4)}T17:30:00Z`,
  },
];

// Mutable state for mock operations
let records = [...mockTimeRecords];
let nextId = 5;

export const getAllRecords = (): TimeRecord[] => {
  return [...records].sort((a, b) => 
    new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  );
};

export const getTodayRecords = (): TimeRecord[] => {
  const today = getToday();
  return records.filter(r => r.checkInTime.startsWith(today));
};

export const getCurrentOpenRecord = (): TimeRecord | undefined => {
  return records.find(r => !r.checkOutTime);
};

export const checkIn = (location?: string, notes?: string): TimeRecord => {
  const now = new Date().toISOString();
  const newRecord: TimeRecord = {
    id: `rec-${String(nextId++).padStart(3, '0')}`,
    userId: mockCurrentUser.id,
    userName: mockCurrentUser.displayName,
    checkInTime: now,
    location: location || 'Main Office',
    notes,
    createdAt: now,
    updatedAt: now,
  };
  records.push(newRecord);
  return newRecord;
};

export const checkOut = (recordId: string, notes?: string): TimeRecord | null => {
  const index = records.findIndex(r => r.id === recordId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  records[index] = {
    ...records[index],
    checkOutTime: now,
    notes: notes || records[index].notes,
    updatedAt: now,
  };
  return records[index];
};

export const calculateHours = (checkIn: string, checkOut?: string): number => {
  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();
  return (end - start) / (1000 * 60 * 60); // Convert ms to hours
};

export const getTodayTotalHours = (): number => {
  const todayRecords = getTodayRecords();
  return todayRecords.reduce((sum, r) => {
    return sum + calculateHours(r.checkInTime, r.checkOutTime);
  }, 0);
};

export const getWeekTotalHours = (): number => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  monday.setHours(0, 0, 0, 0);

  return records
    .filter(r => new Date(r.checkInTime) >= monday)
    .reduce((sum, r) => sum + calculateHours(r.checkInTime, r.checkOutTime), 0);
};

export const resetMockData = (): void => {
  records = [...mockTimeRecords];
  nextId = 5;
};
