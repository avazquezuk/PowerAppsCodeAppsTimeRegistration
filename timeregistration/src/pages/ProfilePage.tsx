import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  shorthands,
  Card,
  Avatar,
  Badge,
  Spinner,
} from '@fluentui/react-components';
import {
  Mail24Regular,
  Building24Regular,
  Location24Regular,
  CalendarClock24Regular,
} from '@fluentui/react-icons';
import { User } from '../types';
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
  profileCard: {
    ...shorthands.padding(tokens.spacingVerticalXL),
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: tokens.spacingVerticalL,
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalL),
    marginBottom: tokens.spacingVerticalL,
    ...shorthands.padding(tokens.spacingVerticalL, '0'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  profileName: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXXS,
  },
  profileEmail: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  infoIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
    marginTop: '2px',
  },
  infoContent: {
    flex: '1',
  },
  infoLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalXXS,
  },
  infoValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statsCard: {
    ...shorthands.padding(tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  statItem: {
    textAlign: 'center',
    ...shorthands.padding(tokens.spacingVerticalM),
  },
  statValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalXS,
  },
});

export const ProfilePage: React.FC = () => {
  const styles = useStyles();
  const [user, setUser] = useState<User | null>(null);
  const [weekTotalHours, setWeekTotalHours] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log('[ProfilePage] Loading profile data');
      const service = getTimeRegistrationService();
      
      // Load user
      const userResult = await service.getCurrentUser();
      console.log('[ProfilePage] User result:', userResult);
      if (userResult.success && userResult.data) {
        setUser(userResult.data);
      }

      // Load statistics
      const statusResult = await service.getStatus();
      console.log('[ProfilePage] Status result:', statusResult);
      if (statusResult.success && statusResult.data) {
        setWeekTotalHours(statusResult.data.weekTotalHours);
      }

      // Load all records to count total
      const recordsResult = await service.getRecentRecords(90);
      console.log('[ProfilePage] Records result:', recordsResult);
      if (recordsResult.success && recordsResult.data) {
        setTotalRecords(recordsResult.data.length);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading || !user) {
    return (
      <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalXXL }}>
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Calculate member since (mock - use current date minus some time)
  const memberSince = new Date();
  memberSince.setMonth(memberSince.getMonth() - 6); // 6 months ago

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>My Profile</Text>
        <Text className={styles.subtitle}>
          View your personal information and work statistics
        </Text>
      </div>

      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar
            name={user.displayName}
            size={72}
            color="colorful"
          />
          <div>
            <Text className={styles.profileName}>{user.displayName}</Text>
            <Text className={styles.profileEmail}>{user.email}</Text>
            <Badge appearance="tint" color="success" style={{ marginTop: tokens.spacingVerticalXS }}>
              Active
            </Badge>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Mail24Regular className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <Text className={styles.infoLabel}>Email Address</Text>
              <Text className={styles.infoValue}>{user.email}</Text>
            </div>
          </div>

          {user.department && (
            <div className={styles.infoItem}>
              <Building24Regular className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <Text className={styles.infoLabel}>Department</Text>
                <Text className={styles.infoValue}>{user.department}</Text>
              </div>
            </div>
          )}

          <div className={styles.infoItem}>
            <Location24Regular className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <Text className={styles.infoLabel}>Primary Location</Text>
              <Text className={styles.infoValue}>Main Office</Text>
            </div>
          </div>

          <div className={styles.infoItem}>
            <CalendarClock24Regular className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <Text className={styles.infoLabel}>Member Since</Text>
              <Text className={styles.infoValue}>
                {memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className={styles.statsCard}>
        <Text
          style={{
            fontSize: tokens.fontSizeBase400,
            fontWeight: tokens.fontWeightSemibold,
            color: tokens.colorNeutralForeground1,
            marginBottom: tokens.spacingVerticalL,
            display: 'block',
          }}
        >
          Work Statistics
        </Text>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>{formatHours(weekTotalHours)}</Text>
            <Text className={styles.statLabel}>This Week</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>{totalRecords}</Text>
            <Text className={styles.statLabel}>Total Check-ins</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>
              {totalRecords > 0 ? (weekTotalHours / 5).toFixed(1) : '0.0'}h
            </Text>
            <Text className={styles.statLabel}>Daily Average</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};
