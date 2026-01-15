import React from 'react';
import {
  makeStyles,
  tokens,
  Tab,
  TabList,
  shorthands,
} from '@fluentui/react-components';
import {
  Home24Regular,
  History24Regular,
  Person24Regular,
  PeopleTeam24Regular,
  DocumentText24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  tabList: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingHorizontalXL),
  },
});

export type EmployeeNavigationTab = 'dashboard' | 'history' | 'profile';
export type ManagerNavigationTab = 'manager-dashboard' | 'manager-reports' | 'profile';
export type NavigationTab = EmployeeNavigationTab | ManagerNavigationTab;

interface NavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  role: 'employee' | 'manager';
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, role }) => {
  const styles = useStyles();

  if (role === 'manager') {
    return (
      <TabList
        selectedValue={currentTab}
        onTabSelect={(_, data) => onTabChange(data.value as NavigationTab)}
        className={styles.tabList}
      >
        <Tab value="manager-dashboard" icon={<PeopleTeam24Regular />}>
          Team Dashboard
        </Tab>
        <Tab value="manager-reports" icon={<DocumentText24Regular />}>
          Team Reports
        </Tab>
        <Tab value="profile" icon={<Person24Regular />}>
          Profile
        </Tab>
      </TabList>
    );
  }

  return (
    <TabList
      selectedValue={currentTab}
      onTabSelect={(_, data) => onTabChange(data.value as NavigationTab)}
      className={styles.tabList}
    >
      <Tab value="dashboard" icon={<Home24Regular />}>
        Dashboard
      </Tab>
      <Tab value="history" icon={<History24Regular />}>
        History
      </Tab>
      <Tab value="profile" icon={<Person24Regular />}>
        Profile
      </Tab>
    </TabList>
  );
};
