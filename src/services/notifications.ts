/**
 * Sistema de notificações locais agendadas — BumUp
 *
 * Segmentos:
 *  1. quiz_not_completed   — instalou mas não terminou o onboarding (24h)
 *  2. not_subscribed       — terminou o onboarding mas não assinou (3h, 24h, 72h)
 *  3. inactive_subscriber  — assinou mas ficou inativo (3 dias, 7 dias)
 *  4. workout_reminder     — lembrete diário de treino (opcional, configurável)
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import storage from '../store/storage';

// ─── Chaves de storage ────────────────────────────────────────────────────────
const KEYS = {
  permissionAsked:   '@notif_permission_asked',
  lastOpenDate:      '@notif_last_open',
  quizScheduled:     '@notif_quiz_scheduled',
  paywallScheduled:  '@notif_paywall_scheduled',
  inactiveScheduled: '@notif_inactive_scheduled',
};

// ─── Configurar handler de notificações recebidas ────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Solicitar permissão ──────────────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  await storage.setItem(KEYS.permissionAsked, 'true');
  return status === 'granted';
}

// ─── Cancelar notificações por identificador ──────────────────────────────────
async function cancelByIdentifier(identifier: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (_) {
    // ignora se não existir
  }
}

// ─── Agendar notificação com trigger de segundos ──────────────────────────────
async function scheduleAfterSeconds(
  id: string,
  title: string,
  body: string,
  seconds: number,
): Promise<void> {
  await cancelByIdentifier(id);
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, repeats: false },
  });
}

// ─── 1. Quiz não completado ───────────────────────────────────────────────────
// Chamar assim que o app abre pela primeira vez (antes do onboarding)
export async function scheduleQuizReminder(): Promise<void> {
  const already = await storage.getItem(KEYS.quizScheduled);
  if (already) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  // 6 horas
  await scheduleAfterSeconds(
    'quiz_reminder_1',
    '🍑 Seu plano te espera!',
    'Você começou a montar seu plano mas não terminou. Só faltam alguns passos!',
    6 * 60 * 60,
  );

  // 24 horas
  await scheduleAfterSeconds(
    'quiz_reminder_2',
    '💪 Não desista antes de começar!',
    'Seu programa personalizado de glúteos está quase pronto. Complete agora!',
    24 * 60 * 60,
  );

  await storage.setItem(KEYS.quizScheduled, 'true');
}

// Cancelar quando o quiz for completado
export async function cancelQuizReminders(): Promise<void> {
  await cancelByIdentifier('quiz_reminder_1');
  await cancelByIdentifier('quiz_reminder_2');
}

// ─── 2. Não assinou (paywall não converteu) ───────────────────────────────────
// Chamar quando o usuário chega na tela de paywall
export async function schedulePaywallReminders(): Promise<void> {
  const already = await storage.getItem(KEYS.paywallScheduled);
  if (already) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  // 3 horas
  await scheduleAfterSeconds(
    'paywall_reminder_1',
    '🔥 Seu programa está esperando!',
    'Desbloqueie seu treino completo e comece a transformação hoje.',
    3 * 60 * 60,
  );

  // 24 horas
  await scheduleAfterSeconds(
    'paywall_reminder_2',
    '⏳ Oferta especial para você',
    'Seu plano personalizado ainda está disponível. Garanta o acesso agora!',
    24 * 60 * 60,
  );

  // 72 horas
  await scheduleAfterSeconds(
    'paywall_reminder_3',
    '💜 A mudança começa com um passo',
    'Centenas de mulheres já transformaram o bumbum. Você é a próxima?',
    72 * 60 * 60,
  );

  await storage.setItem(KEYS.paywallScheduled, 'true');
}

// Cancelar quando assinar
export async function cancelPaywallReminders(): Promise<void> {
  await cancelByIdentifier('paywall_reminder_1');
  await cancelByIdentifier('paywall_reminder_2');
  await cancelByIdentifier('paywall_reminder_3');
  await storage.removeItem(KEYS.paywallScheduled);
}

// ─── 3. Assinante inativo ─────────────────────────────────────────────────────
// Chamar toda vez que o app abre (para atualizar a data da última abertura)
export async function scheduleInactivityReminders(): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  // Cancela os anteriores e reagenda a partir de agora
  await cancelByIdentifier('inactive_reminder_3d');
  await cancelByIdentifier('inactive_reminder_7d');

  // 3 dias sem abrir
  await scheduleAfterSeconds(
    'inactive_reminder_3d',
    '🍑 Saudade de você!',
    'Faz 3 dias que você não treina. Que tal voltar hoje com 15 minutinhos?',
    3 * 24 * 60 * 60,
  );

  // 7 dias sem abrir
  await scheduleAfterSeconds(
    'inactive_reminder_7d',
    '💪 Não deixa a consistência escapar!',
    'Uma semana sem treino. Volte agora e retome seus resultados!',
    7 * 24 * 60 * 60,
  );

  await storage.setItem(KEYS.lastOpenDate, new Date().toISOString());
}

// ─── 4. Lembrete diário de treino (opt-in) ────────────────────────────────────
// Agendamento de notificação diária em horário fixo
export async function scheduleDailyWorkoutReminder(hour: number = 18, minute: number = 0): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await cancelByIdentifier('daily_workout_reminder');

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily_workout_reminder',
    content: {
      title: '🏋️ Hora do treino!',
      body: 'Seu bumbum agradece cada repetição. Vamos lá?',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyWorkoutReminder(): Promise<void> {
  await cancelByIdentifier('daily_workout_reminder');
}

// ─── Cancelar TUDO ────────────────────────────────────────────────────────────
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Listener para tap na notificação ────────────────────────────────────────
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void,
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
