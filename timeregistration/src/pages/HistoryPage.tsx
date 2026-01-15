import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  shorthands,
  Card,
  Dropdown,
  Option,
  Field,
  Badge,
  Tooltip,
  Spinner,
  Button,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
} from '@fluentui/react-icons';
import { TimeRecord } from '../types';
import { getTimeRegistrationService } from '../services/TimeRegistrationService';

const useStyles = makeStyles({
  container: {
    maxWidth: '800px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding(tokens.spacingVerticalL),
  },
  header: {
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXS,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase200,
  },
  filterSection: {
    ...shorthands.padding(tokens.spacingVerticalM),
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: tokens.spacingVerticalL,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalM),
    flexWrap: 'wrap',
  },
  filterField: {
    flex: '1',
    minWidth: '200px',
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    ...shorthands.gap(tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalL,
  },
  summaryCard: {
    ...shorthands.padding(tokens.spacingVerticalM),
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  summaryValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  summaryLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalXS,
  },
  tableCard: {
    marginTop: tokens.spacingVerticalL,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  paginationInfo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  paginationButtons: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
});

export const HistoryPage: React.FC = () => {
  const styles = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7');
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Load records based on selected period
  useEffect(() => {
    const loadRecords = async () => {
      console.log('[HistoryPage] Loading records for period:', selectedPeriod);
      setIsLoading(true);
      const service = getTimeRegistrationService();
      const days = parseInt(selectedPeriod);
      const result = await service.getRecentRecords(days);
      console.log('[HistoryPage] Records result:', result);
      if (result.success && result.data) {
        console.log('[HistoryPage] Setting records:', result.data.length, 'records');
        setRecords(result.data);
        setCurrentPage(1); // Reset to first page when period changes
      }
      setIsLoading(false);
    };

    loadRecords();
  }, [selectedPeriod]);

  // Filter records based on selected period
  const getFilteredRecords = () => {
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return records.filter(r => new Date(r.checkInTime) >= cutoffDate);
  };

  const filteredRecords = getFilteredRecords();

  // Calculate summary statistics
  const calculateTotalHours = (recs: TimeRecord[]): number => {
    return recs.reduce((sum, r) => {
      const start = new Date(r.checkInTime).getTime();
      const end = r.checkOutTime ? new Date(r.checkOutTime).getTime() : Date.now();
      const hours = (end - start) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
  };

  const totalHours = calculateTotalHours(filteredRecords);
  const completedShifts = filteredRecords.filter(r => r.checkOutTime).length;
  const averageHours = completedShifts > 0 ? totalHours / completedShifts : 0;

  const formatHours = (hours: number): string => {
    return hours.toFixed(1);
  };

  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateHours = (checkIn: string, checkOut?: string): number => {
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : Date.now();
    return (end - start) / (1000 * 60 * 60);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(records.length / recordsPerPage));
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedRecords = records.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Work History</Text>
        <Text className={styles.subtitle}>
          View your time registration history and statistics
        </Text>
      </div>

      <Card className={styles.filterSection}>
        <div className={styles.filterRow}>
          <Field label="Time Period" className={styles.filterField}>
            <Dropdown
              value={`Last ${selectedPeriod} days`}
              onOptionSelect={(_, data) => data.optionValue && setSelectedPeriod(data.optionValue)}
            >
              <Option value="7">Last 7 days</Option>
              <Option value="14">Last 14 days</Option>
              <Option value="30">Last 30 days</Option>
              <Option value="60">Last 60 days</Option>
              <Option value="90">Last 90 days</Option>
            </Dropdown>
          </Field>
        </div>
      </Card>

      <div className={styles.summaryCards}>
        <Card className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{formatHours(totalHours)}h</Text>
          <Text className={styles.summaryLabel}>Total Hours</Text>
        </Card>
        <Card className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{completedShifts}</Text>
          <Text className={styles.summaryLabel}>Completed Shifts</Text>
        </Card>
        <Card className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{formatHours(averageHours)}h</Text>
          <Text className={styles.summaryLabel}>Avg per Shift</Text>
        </Card>
      </div>

      <Card className={styles.tableCard}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalXXL }}>
            <Spinner label="Loading records..." />
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: tokens.spacingVerticalXXL, textAlign: 'center' }}>
            <Text style={{ color: tokens.colorNeutralForeground3 }}>
              No time records found for the selected period
            </Text>
          </div>
        ) : (
          <>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.colorNeutralBackground2, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Check In</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Check Out</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Location</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Hours</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: tokens.fontWeightSemibold }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record, index) => {
                    const hours = calculateHours(record.checkInTime, record.checkOutTime);
                    const isInProgress = !record.checkOutTime;
                    
                    return (
                      <tr key={record.id} style={{ 
                        backgroundColor: index % 2 === 0 ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackground2,
                        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
                      }}>
                        <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                          <div style={{ fontWeight: tokens.fontWeightSemibold }}>
                            {formatDate(record.checkInTime)}
                          </div>
                          <div style={{ fontSize: tokens.fontSizeBase100, color: tokens.colorNeutralForeground3 }}>
                            {new Date(record.checkInTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                          {formatTime(record.checkInTime)}
                        </td>
                        <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                          {record.checkOutTime ? formatTime(record.checkOutTime) : (
                            <Text style={{ color: tokens.colorPaletteGreenForeground1, fontStyle: 'italic' }}>
                              In progress
                            </Text>
                          )}
                        </td>
                        <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                          <Tooltip content={record.location || 'No location'} relationship="description">
                            <div style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              maxWidth: '150px'
                            }}>
                              {record.location ? `📍 ${record.location}` : 'No location'}
                            </div>
                          </Tooltip>
                        </td>
                        <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, textAlign: 'right' }}>
                          <span style={{ 
                            fontWeight: tokens.fontWeightSemibold,
                            color: tokens.colorBrandForeground1,
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {Math.floor(hours)}h {Math.round((hours % 1) * 60)}m
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Badge 
                            appearance={isInProgress ? 'filled' : 'tint'}
                            color={isInProgress ? 'success' : 'brand'}
                          >
                            {isInProgress ? 'In Progress' : 'Completed'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={styles.paginationContainer}>
              <Text className={styles.paginationInfo}>
                Page {currentPage} of {totalPages} • {records.length} total records
              </Text>
              
              <div className={styles.paginationButtons}>
                <Button
                  icon={<ChevronLeftRegular />}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <Button
                  icon={<ChevronRightRegular />}
                  iconPosition="after"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoading}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
