import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Text,
  Input,
  Field,
  Title1,
  Spinner,
  shorthands,
  Badge,
  RadioGroup,
  Radio,
} from '@fluentui/react-components';
import { 
  Person24Regular, 
  LockClosed24Regular,
  Clock24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalXL),
  },
  card: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
    width: '100%',
    maxWidth: '400px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalXL,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorBrandForeground1,
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  button: {
    marginTop: tokens.spacingVerticalM,
    minHeight: '44px',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    textAlign: 'center',
    marginTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
  },
  demoHint: {
    marginTop: tokens.spacingVerticalL,
    ...shorthands.padding(tokens.spacingVerticalM),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    textAlign: 'center',
  },
  demoBadge: {
    marginBottom: tokens.spacingVerticalM,
  },
});

interface LoginScreenProps {
  onLogin: (email: string, role: 'employee' | 'manager') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const styles = useStyles();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo: accept any email/password combination
    // In production, this would call an authentication service
    onLogin(email, role);
    
    setIsLoading(false);
  };

  const handleDemoLogin = (demoRole: 'employee' | 'manager') => {
    if (demoRole === 'employee') {
      setEmail('john.doe@contoso.com');
      setRole('employee');
    } else {
      setEmail('sarah.manager@contoso.com');
      setRole('manager');
    }
    setPassword('demo123');
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Clock24Regular className={styles.icon} />
          <Title1 className={styles.title}>Time Registration</Title1>
          <Text className={styles.subtitle}>Sign in to continue</Text>
        </div>

        <Badge className={styles.demoBadge} appearance="tint" color="important">
          📋 Demo Mode - Using Mock Authentication
        </Badge>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(_, data) => setEmail(data.value)}
              contentBefore={<Person24Regular />}
              placeholder="your.email@company.com"
              disabled={isLoading}
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(_, data) => setPassword(data.value)}
              contentBefore={<LockClosed24Regular />}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </Field>

          <Field label="Role">
            <RadioGroup
              value={role}
              onChange={(_, data) => setRole(data.value as 'employee' | 'manager')}
            >
              <Radio value="employee" label="Employee" />
              <Radio value="manager" label="Manager" />
            </RadioGroup>
          </Field>

          {error && <Text className={styles.error}>{error}</Text>}

          <Button
            appearance="primary"
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="tiny" /> : 'Sign In'}
          </Button>
        </form>

        <div className={styles.demoHint}>
          <Text style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, marginBottom: tokens.spacingVerticalM, display: 'block' }}>
            💡 Quick Demo Login:
          </Text>
          <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, justifyContent: 'center' }}>
            <Button
              size="small"
              appearance="outline"
              onClick={() => handleDemoLogin('employee')}
              disabled={isLoading}
            >
              Employee Demo
            </Button>
            <Button
              size="small"
              appearance="outline"
              onClick={() => handleDemoLogin('manager')}
              disabled={isLoading}
            >
              Manager Demo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
