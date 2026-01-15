import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Text,
  Spinner,
  Badge,
  Dropdown,
  Option,
  Field,
} from '@fluentui/react-components';
import {
  SignOut24Regular,
  Location24Regular,
  Clock24Regular,
} from '@fluentui/react-icons';
import { CheckInStatus } from '../types';
import { getTimeRegistrationService } from '../services/TimeRegistrationService';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalXL,
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  statusSection: {
    marginBottom: tokens.spacingVerticalXL,
  },
  statusBadge: {
    fontSize: tokens.fontSizeBase400,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
  },
  timeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
  },
  elapsedTime: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  button: {
    marginTop: tokens.spacingVerticalL,
    minWidth: '200px',
    minHeight: '56px',
    fontSize: tokens.fontSizeBase400,
  },
  checkInButton: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    ':hover': {
      backgroundColor: tokens.colorPaletteGreenBackground2,
    },
  },
  checkOutButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
  summaryCard: {
    padding: tokens.spacingVerticalM,
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  summaryValue: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  summaryLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  locationSelector: {
    marginTop: tokens.spacingVerticalL,
    textAlign: 'left',
  },
});

// Available work locations
const WORK_LOCATIONS = [
  'Main Office',
  'Branch Office',
  'Home Office',
  'Client Site',
  'Remote',
];

interface CheckInOutCardProps {
  onStatusChange: () => void;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({ onStatusChange }) => {
  const styles = useStyles();
  const service = getTimeRegistrationService();

  const [status, setStatus] = useState<CheckInStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>(WORK_LOCATIONS[0]);

  // Load status
  const loadStatus = async () => {
    const result = await service.getStatus();
    if (result.success && result.data) {
      setStatus(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Update elapsed time every second when checked in
  useEffect(() => {
    if (!status?.isCheckedIn || !status.currentRecord) {
      setElapsedTime('00:00:00');
      return;
    }

    const updateElapsed = () => {
      const checkInTime = new Date(status.currentRecord!.checkInTime).getTime();
      const now = Date.now();
      const diff = now - checkInTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [status?.isCheckedIn, status?.currentRecord]);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await service.checkIn(selectedLocation);
    if (result.success) {
      await loadStatus();
      onStatusChange();
    } else {
      setError(result.errorMessage || 'Failed to check in');
    }

    setIsProcessing(false);
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await service.checkOut();
    if (result.success) {
      await loadStatus();
      onStatusChange();
    } else {
      setError(result.errorMessage || 'Failed to check out');
    }

    setIsProcessing(false);
  };

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <Card className={styles.card}>
        <Spinner label="Loading status..." />
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <div className={styles.statusSection}>
        <Badge
          appearance="filled"
          color={status?.isCheckedIn ? 'success' : 'informative'}
          className={styles.statusBadge}
        >
          {status?.isCheckedIn ? '✓ Checked In' : '○ Checked Out'}
        </Badge>

        {status?.isCheckedIn && status.currentRecord && (
          <div className={styles.timeInfo}>
            <div className={styles.timeRow}>
              <Clock24Regular />
              <Text>Checked in at {new Date(status.currentRecord.checkInTime).toLocaleTimeString()}</Text>
            </div>
            <div className={styles.timeRow}>
              <Location24Regular />
              <Text>{status.currentRecord.location || 'Main Office'}</Text>
            </div>
            <Text className={styles.elapsedTime}>{elapsedTime}</Text>
          </div>
        )}
      </div>

      {error && (
        <Text style={{ color: tokens.colorPaletteRedForeground1, marginBottom: tokens.spacingVerticalM }}>
          {error}
        </Text>
      )}

      {status?.isCheckedIn ? (
        <Button
          appearance="primary"
          className={`${styles.button} ${styles.checkOutButton}`}
          icon={<SignOut24Regular />}
          onClick={handleCheckOut}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Check Out'}
        </Button>
      ) : (
        <>
          <Field label="Work Location" className={styles.locationSelector}>
            <Dropdown
              value={selectedLocation}
              onOptionSelect={(_, data) => data.optionValue && setSelectedLocation(data.optionValue)}
              aria-label="Select work location"
            >
              {WORK_LOCATIONS.map(location => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Button
            appearance="primary"
            className={`${styles.button} ${styles.checkInButton}`}
            icon={<Location24Regular />}
            onClick={handleCheckIn}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Check In'}
          </Button>
        </>
      )}

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <Text className={styles.summaryValue} block>
            {formatHours(status?.todayTotalHours || 0)}
          </Text>
          <Text className={styles.summaryLabel}>Today</Text>
        </div>
        <div className={styles.summaryCard}>
          <Text className={styles.summaryValue} block>
            {formatHours(status?.weekTotalHours || 0)}
          </Text>
          <Text className={styles.summaryLabel}>This Week</Text>
        </div>
      </div>
    </Card>
  );
};
