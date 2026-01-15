import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Text,
  shorthands,
  Card,
  Badge,
  Spinner,
  Avatar,
  SearchBox,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  People24Regular,
  Clock24Regular,
  CheckmarkCircle24Regular,
  Location24Regular,
  SearchRegular,
  MoreHorizontal24Regular,
  Checkmark24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { TeamMemberSummary, TeamStatistics } from '../types';
import { getTeamMemberSummaries, calculateTeamStatistics } from '../mockData/teamData';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
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
  searchContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    alignItems: 'flex-end',
    marginBottom: tokens.spacingVerticalL,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    ...shorthands.gap(tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalXL,
  },
  statCard: {
    ...shorthands.padding(tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    marginBottom: tokens.spacingVerticalS,
  },
  statIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  statValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  teamCard: {
    ...shorthands.padding(tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  teamHeader: {
    marginBottom: tokens.spacingVerticalL,
  },
  teamTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  teamGrid: {
    display: 'grid',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  memberRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  memberDetails: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXXS),
  },
  memberName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  memberEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  memberStat: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    fontVariantNumeric: 'tabular-nums',
  },
  locationText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    marginBottom: tokens.spacingVerticalS,
  },
  tableHeaderCell: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
  },
});

export const ManagerDashboardPage: React.FC = () => {
  const styles = useStyles();
  const [teamMembers, setTeamMembers] = useState<TeamMemberSummary[]>([]);
  const [statistics, setStatistics] = useState<TeamStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      console.log('[ManagerDashboard] Loading team data');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const members = getTeamMemberSummaries();
      const stats = calculateTeamStatistics();
      
      console.log('[ManagerDashboard] Team members:', members);
      console.log('[ManagerDashboard] Statistics:', stats);
      
      setTeamMembers(members);
      setStatistics(stats);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusBadge = (status: 'checked-in' | 'checked-out' | 'not-started') => {
    switch (status) {
      case 'checked-in':
        return <Badge appearance="filled" color="success">Checked In</Badge>;
      case 'checked-out':
        return <Badge appearance="tint" color="brand">Checked Out</Badge>;
      case 'not-started':
        return <Badge appearance="outline" color="subtle">Not Started</Badge>;
    }
  };
  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(member => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      member.user.displayName.toLowerCase().includes(search) ||
      member.user.email.toLowerCase().includes(search) ||
      (member.currentLocation && member.currentLocation.toLowerCase().includes(search))
    );
  });
  if (isLoading || !statistics) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalXXL }}>
          <Spinner label="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Manager Dashboard</Text>
        <Text className={styles.subtitle}>
          Overview of team attendance and work hours
        </Text>
      </div>

      {/* Search Toolbar */}
      <div className={styles.searchContainer}>
        <SearchBox
          placeholder="Search employees by name, email, or location..."
          value={searchTerm}
          onChange={(_, data) => setSearchTerm(data.value)}
          style={{ flexGrow: 1, maxWidth: '500px' }}
        />
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <People24Regular className={styles.statIcon} />
            <Text className={styles.statLabel}>Team Members</Text>
          </div>
          <Text className={styles.statValue}>{statistics.totalEmployees}</Text>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <CheckmarkCircle24Regular className={styles.statIcon} />
            <Text className={styles.statLabel}>Currently Checked In</Text>
          </div>
          <Text className={styles.statValue}>{statistics.currentlyCheckedIn}</Text>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Clock24Regular className={styles.statIcon} />
            <Text className={styles.statLabel}>Today's Total</Text>
          </div>
          <Text className={styles.statValue}>{formatHours(statistics.todayTotalHours)}</Text>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Clock24Regular className={styles.statIcon} />
            <Text className={styles.statLabel}>This Week</Text>
          </div>
          <Text className={styles.statValue}>{formatHours(statistics.weekTotalHours)}</Text>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Clock24Regular className={styles.statIcon} />
            <Text className={styles.statLabel}>Avg per Employee</Text>
          </div>
          <Text className={styles.statValue}>{formatHours(statistics.averageHoursPerEmployee)}</Text>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card className={styles.teamCard}>
        <div className={styles.teamHeader}>
          <Text className={styles.teamTitle}>Team Status</Text>
        </div>

        <div className={styles.tableHeader}>
          <Text className={styles.tableHeaderCell}>Employee</Text>
          <Text className={styles.tableHeaderCell}>Status</Text>
          <Text className={styles.tableHeaderCell}>Today</Text>
          <Text className={styles.tableHeaderCell}>This Week</Text>
          <Text className={styles.tableHeaderCell}>Location</Text>
          <Text className={styles.tableHeaderCell}>Actions</Text>
        </div>

        <div className={styles.teamGrid}>
          {filteredMembers.length === 0 ? (
            <div style={{ padding: tokens.spacingVerticalXL, textAlign: 'center' }}>
              <SearchRegular style={{ fontSize: '48px', color: tokens.colorNeutralForeground3, marginBottom: tokens.spacingVerticalM }} />
              <Text style={{ color: tokens.colorNeutralForeground3, display: 'block' }}>
                No employees found matching "{searchTerm}"
              </Text>
            </div>
          ) : (
            filteredMembers.map(member => (
            <div key={member.user.id} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <Avatar
                  name={member.user.displayName}
                  size={40}
                  color="colorful"
                />
                <div className={styles.memberDetails}>
                  <Text className={styles.memberName}>{member.user.displayName}</Text>
                  <Text className={styles.memberEmail}>{member.user.email}</Text>
                </div>
              </div>
              <div>
                {getStatusBadge(member.todayStatus)}
              </div>
              <Text className={styles.memberStat}>{formatHours(member.todayHours)}</Text>
              <Text className={styles.memberStat}>{formatHours(member.weekHours)}</Text>
              <div>
                {member.currentLocation ? (
                  <Text className={styles.locationText}>
                    <Location24Regular style={{ fontSize: '16px' }} />
                    {member.currentLocation}
                  </Text>
                ) : (
                  <Text className={styles.locationText}>—</Text>
                )}
              </div>
              <div>
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <Button
                      appearance="subtle"
                      icon={<MoreHorizontal24Regular />}
                      aria-label="Actions"
                      size="small"
                    />
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem
                        icon={<Checkmark24Regular />}
                        onClick={() => handleApprove(member.user.id, member.user.displayName)}
                      >
                        Approve Time
                      </MenuItem>
                      <MenuItem
                        icon={<Dismiss24Regular />}
                        onClick={() => handleReject(member.user.id, member.user.displayName)}
                      >
                        Reject Time
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </div>
            </div>
          )))
          }
        </div>
      </Card>
    </div>
  );
};
