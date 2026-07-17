import type { ComponentType, ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';
import * as Sentry from '@sentry/react-native';

import { environment, isDevelopment } from '@/config/environment';

const sentryEnabled =
  environment.errorMonitoringEnabled &&
  !isDevelopment &&
  environment.sentryDsn !== undefined;

if (sentryEnabled) {
  Sentry.init({
    dsn: environment.sentryDsn,
    enabled: true,
    environment: environment.appEnv,
    sendDefaultPii: false,
    tracesSampleRate: environment.sentryTracesSampleRate,
  });

  Sentry.setTag('app.environment', environment.appEnv);
}

type ErrorBoundaryState = Readonly<{
  error: Error | undefined;
}>;

type ErrorBoundaryProps = PropsWithChildren<
  Readonly<{
    fallback: ReactNode;
    reportError: (error: Error, info: ErrorInfo) => void;
  }>
>;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { error: undefined };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public override componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.reportError(error, info);
  }

  public override render() {
    if (this.state.error !== undefined) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function reportUnhandledError(error: Error, info: ErrorInfo) {
  if (!sentryEnabled) {
    return;
  }

  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: info.componentStack ?? undefined,
      },
    },
    tags: {
      'app.environment': environment.appEnv,
    },
  });
}

export function withObservability<TProps extends object>(
  Screen: ComponentType<TProps>,
) {
  function ObservedScreen(props: TProps) {
    return (
      <ErrorBoundary fallback={null} reportError={reportUnhandledError}>
        <Screen {...props} />
      </ErrorBoundary>
    );
  }

  return ObservedScreen;
}
