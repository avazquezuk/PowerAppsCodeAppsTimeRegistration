// Time Registration Types - Check In/Out System

export interface TimeRecord {
  id: string;
  userId: string;
  userName: string;
  checkInTime: string;      // ISO datetime
  checkOutTime?: string;    // ISO datetime, undefined if still checked in
  location?: string;
  notes?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'sync-failed';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  department?: string;
  role: 'employee' | 'manager';
}

export interface TeamMemberSummary {
  user: User;
  todayStatus: 'checked-in' | 'checked-out' | 'not-started';
  todayHours: number;
  weekHours: number;
  currentLocation?: string;
  lastCheckIn?: string;
}

export interface CheckInStatus {
  isCheckedIn: boolean;
  currentRecord?: TimeRecord;
  todayTotalHours: number;
  weekTotalHours: number;
}

export interface DailySummary {
  date: string;
  totalHours: number;
  records: TimeRecord[];
}

export interface TeamStatistics {
  totalEmployees: number;
  currentlyCheckedIn: number;
  todayTotalHours: number;
  weekTotalHours: number;
  averageHoursPerEmployee: number;
}

// Service Response Types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
}
