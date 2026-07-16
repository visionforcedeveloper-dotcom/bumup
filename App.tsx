import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ProcessingScreen } from './src/screens/ProcessingScreen';
import { TestimonialsScreen } from './src/screens/TestimonialsScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { useStore } from './src/store/useStore';
import { colors } from './src/theme';
import { revenueCatService } from './src/services/revenueCat';
import {
  scheduleConversionCycle,
  cancelConversionCycle,
  scheduleInactivityReminders,
} from './src/services/notifications';
import storage from './src/store/storage';

type FlowStep = 'loading' | 'quiz' | 'processing' | 'testimonials' | 'paywall' | 'app';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#0D0B0E', padding: 20 }}>
          <Text style={{ color: '#F87171', fontSize: 18, fontWeight: '700', marginTop: 60 }}>
            Erro na aplicação:
          </Text>
          <Text style={{ color: '#fff', fontSize: 13, marginTop: 12, lineHeight: 20 }}>
            {err.message}
          </Text>
          <Text style={{ color: '#A090A8', fontSize: 11, marginTop: 16, lineHeight: 18 }}>
            {err.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { loadProfile, onboarded, profileLoaded, completeOnboarding } = useStore();
  const [step, setStep] = useState<FlowStep>('loading');
  const [nativeError, setNativeError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    if (global.ErrorUtils) {
      // @ts-ignore
      const prev = global.ErrorUtils.getGlobalHandler();
      // @ts-ignore
      global.ErrorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
        if (isFatal) setNativeError(`FATAL: ${error.message}\n${error.stack}`);
        prev(error, isFatal);
      });
    }
  }, []);

  useEffect(() => {
    loadProfile().then(() => {});
    revenueCatService.initialize().catch(() => {});
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;

    if (onboarded) {
      // Já assinou — cancela ciclo de conversão e agenda inatividade
      cancelConversionCycle().catch(() => {});
      scheduleInactivityReminders().catch(() => {});
      setStep('app');
    } else {
      storage.getItem('@bumup_flow_step').then((savedStep) => {
        if (
          savedStep === 'paywall' ||
          savedStep === 'testimonials' ||
          savedStep === 'processing'
        ) {
          // Ainda não assinou — garante que o ciclo de notificações está rodando
          scheduleConversionCycle().catch(() => {});
          setStep(savedStep as FlowStep);
        } else {
          setStep('quiz');
        }
      });
    }
  }, [profileLoaded, onboarded]);

  if (nativeError) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#0D0B0E', padding: 20 }}>
        <Text style={{ color: '#F87171', fontSize: 16, fontWeight: '700', marginTop: 60 }}>
          Erro capturado:
        </Text>
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 12, lineHeight: 18 }}>
          {nativeError}
        </Text>
      </ScrollView>
    );
  }

  if (step === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const goToStep = (s: FlowStep) => {
    storage.setItem('@bumup_flow_step', s).catch(() => {});
    setStep(s);
  };

  if (step === 'quiz') {
    return (
      <OnboardingScreen onComplete={() => goToStep('processing')} />
    );
  }

  if (step === 'processing') {
    return (
      <ProcessingScreen onDone={() => goToStep('testimonials')} />
    );
  }

  if (step === 'testimonials') {
    return (
      <TestimonialsScreen onContinue={() => {
        // Usuário chegou no paywall — inicia ciclo de notificações
        scheduleConversionCycle().catch(() => {});
        goToStep('paywall');
      }} />
    );
  }

  if (step === 'paywall') {
    return (
      <PaywallScreen
        onSubscribe={() => {
          // Assinou — cancela ciclo e agenda inatividade
          cancelConversionCycle().catch(() => {});
          scheduleInactivityReminders().catch(() => {});
          completeOnboarding();
          useStore.getState().setPremium(true);
          setStep('app');
        }}
        onSkip={() => {
          completeOnboarding();
          setStep('app');
        }}
      />
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
