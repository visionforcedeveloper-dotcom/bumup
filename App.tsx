import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { useStore } from './src/store/useStore';
import { colors } from './src/theme';

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
  const { loadProfile, onboarded, profileLoaded, completeOnboarding, updateProfile } = useStore();

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profileLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          completeOnboarding();
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
          <StatusBar style="light" backgroundColor={colors.background} />
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
