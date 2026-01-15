import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  CardHeader,
  Text,
  Spinner,
} from '@fluentui/react-components';
import { TimeRecord } from '../types';

const useStyles = makeStyles({
  card: {
    marginTop: tokens.spacingVerticalL,
  },
  noData: {
    padding: tokens.spacingVerticalL,
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
  recordsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  recordItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    ':last-child': {
      borderBottom: 'none',
    },
  },
  recordDate: {
    fontWeight: tokens.fontWeightSemibold,
  },
  recordTimes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalXS,
  },
  recordHours: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  inProgress: {
    color: tokens.colorPaletteGreenForeground1,
    fontStyle: 'italic',
  },
});

interface TimeHistoryProps {
  records: TimeRecord[];
  isLoading: boolean;
}

export const TimeHistory: React.FC<TimeHistoryProps> = ({ records, isLoading }) => {
  const styles = useStyles();

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

  const calculateHours = (checkIn: string, checkOut?: string): string => {
    const start = new Date(checkIn).getTime();
    const end = checkOut ? new Date(checkOut).getTime() : Date.now();
    const hours = (end - start) / (1000 * 60 * 60);
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <CardHeader header={<Text weight="semibold">Recent History</Text>} />
        <div className={styles.loadingContainer}>
          <Spinner label="Loading history..." />
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Recent History</Text>} />
      
      {records.length === 0 ? (
        <div className={styles.noData}>
          <Text>No time records yet.</Text>
        </div>
      ) : (
        <div className={styles.recordsList}>
          {records.map(record => (
            <div key={record.id} className={styles.recordItem}>
              <div className={styles.recordTimes}>
                <Text className={styles.recordDate}>
                  {formatDate(record.checkInTime)}
                </Text>
                <Text size={200}>
                  {formatTime(record.checkInTime)} → {' '}
                  {record.checkOutTime ? (
                    formatTime(record.checkOutTime)
                  ) : (
                    <span className={styles.inProgress}>In progress</span>
                  )}
                </Text>
                {record.location && (
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    📍 {record.location}
                  </Text>
                )}
              </div>
              <Text className={styles.recordHours}>
                {calculateHours(record.checkInTime, record.checkOutTime)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
