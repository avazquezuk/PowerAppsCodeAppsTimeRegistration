import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  shorthands,
} from '@fluentui/react-components';
import { CheckInOutCard } from '../components/CheckInOutCard';

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
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
});

interface DashboardPageProps {
  onStatusChange: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onStatusChange }) => {
  const styles = useStyles();
  console.log('[DashboardPage] Rendering dashboard');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Dashboard</Text>
        <Text className={styles.subtitle}>
          Check in when you arrive at work and check out when you leave
        </Text>
      </div>
      <CheckInOutCard onStatusChange={onStatusChange} />
    </div>
  );
};
