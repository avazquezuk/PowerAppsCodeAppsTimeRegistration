import {
  TimeRecord,
  User,
  CheckInStatus,
  ServiceResponse,
} from '../types';

// Service interface for check-in/check-out system
export interface ITimeRegistrationService {
  // Check In/Out Operations
  getStatus(): Promise<ServiceResponse<CheckInStatus>>;
  checkIn(location?: string, notes?: string): Promise<ServiceResponse<TimeRecord>>;
  checkOut(notes?: string): Promise<ServiceResponse<TimeRecord>>;
  
  // History
  getRecentRecords(days?: number): Promise<ServiceResponse<TimeRecord[]>>;
  
  // User
  getCurrentUser(): Promise<ServiceResponse<User>>;
}
