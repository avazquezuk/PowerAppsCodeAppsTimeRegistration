import {
  TimeRecord,
  User,
  CheckInStatus,
  ServiceResponse,
} from '../types';
import { ITimeRegistrationService } from './ITimeRegistrationService';
import {
  mockCurrentUser,
  getAllRecords,
  getCurrentOpenRecord,
  checkIn as mockCheckIn,
  checkOut as mockCheckOut,
  getTodayTotalHours,
  getWeekTotalHours,
} from '../mockData/timeRecords';

// Simulated network delay for realistic behavior
const simulateDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export class MockTimeRegistrationService implements ITimeRegistrationService {
  async getStatus(): Promise<ServiceResponse<CheckInStatus>> {
    await simulateDelay(200);
    console.log('[MockService] getStatus called');

    try {
      const currentRecord = getCurrentOpenRecord();
      const status: CheckInStatus = {
        isCheckedIn: !!currentRecord,
        currentRecord,
        todayTotalHours: getTodayTotalHours(),
        weekTotalHours: getWeekTotalHours(),
      };
      return { success: true, data: status };
    } catch (error) {
      console.error('[MockService] getStatus error:', error);
      return { success: false, errorMessage: 'Failed to get status' };
    }
  }

  async checkIn(location?: string, notes?: string): Promise<ServiceResponse<TimeRecord>> {
    await simulateDelay();
    console.log('[MockService] checkIn called:', { location, notes });

    try {
      // Check if already checked in
      const currentRecord = getCurrentOpenRecord();
      if (currentRecord) {
        return { success: false, errorMessage: 'Already checked in. Please check out first.' };
      }

      const record = mockCheckIn(location, notes);
      return { success: true, data: record };
    } catch (error) {
      console.error('[MockService] checkIn error:', error);
      return { success: false, errorMessage: 'Failed to check in' };
    }
  }

  async checkOut(notes?: string): Promise<ServiceResponse<TimeRecord>> {
    await simulateDelay();
    console.log('[MockService] checkOut called:', { notes });

    try {
      const currentRecord = getCurrentOpenRecord();
      if (!currentRecord) {
        return { success: false, errorMessage: 'Not checked in. Please check in first.' };
      }

      const record = mockCheckOut(currentRecord.id, notes);
      if (record) {
        return { success: true, data: record };
      }
      return { success: false, errorMessage: 'Failed to check out' };
    } catch (error) {
      console.error('[MockService] checkOut error:', error);
      return { success: false, errorMessage: 'Failed to check out' };
    }
  }

  async getRecentRecords(days: number = 7): Promise<ServiceResponse<TimeRecord[]>> {
    await simulateDelay();
    console.log('[MockService] getRecentRecords called, days:', days);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const records = getAllRecords().filter(
        r => new Date(r.checkInTime) >= cutoffDate
      );
      return { success: true, data: records };
    } catch (error) {
      console.error('[MockService] getRecentRecords error:', error);
      return { success: false, errorMessage: 'Failed to get records' };
    }
  }

  async getCurrentUser(): Promise<ServiceResponse<User>> {
    await simulateDelay(100);
    console.log('[MockService] getCurrentUser called');
    return { success: true, data: mockCurrentUser };
  }
}

// Singleton instance
let serviceInstance: ITimeRegistrationService | null = null;

export const getTimeRegistrationService = (): ITimeRegistrationService => {
  if (!serviceInstance) {
    serviceInstance = new MockTimeRegistrationService();
  }
  return serviceInstance;
};

export const resetServiceInstance = (): void => {
  serviceInstance = null;
};
