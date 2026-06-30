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
    // Captura erros não tratados
    const handler = (error: ErrorEvent) => {
      setNativeError(error.message || 'Erro desconhecido');
    };
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
  }, []);

  useEffect(() => {
    if (profileLoaded) {
      setStep(onboarded ? 'app' : 'quiz');
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

  if (step === 'quiz') {
    return (
      <OnboardingScreen onComplete={() => setStep('processing')} />
    );
  }

  if (step === 'processing') {
    return (
      <ProcessingScreen onDone={() => setStep('testimonials')} />
    );
  }

  if (step === 'testimonials') {
    return (
      <TestimonialsScreen onContinue={() => setStep('paywall')} />
    );
  }

  if (step === 'paywall') {
    return (
      <PaywallScreen
        onSubscribe={() => { completeOnboarding(); setStep('app'); }}
        onSkip={() => { completeOnboarding(); setStep('app'); }}
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
