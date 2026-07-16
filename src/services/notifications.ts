/**
 * Sistema de notificações locais — BumUp
 *
 * Enquanto o usuário NÃO assinar, recebe notificações em ciclo:
 *   1h → 6h → 24h → 48h → 72h → 7 dias → repete
 *
 * Ao assinar: cancela tudo e agenda apenas lembrete de inatividade.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import storage from '../store/storage';

const KEY_SCHEDULED_IDS = '@notif_scheduled_ids';
const KEY_CYCLE_INDEX   = '@notif_cycle_index';

// ─── Handler padrão ──────────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Mensagens rotativas (ciclo) ─────────────────────────────────────────────
const CYCLE_MESSAGES: { title: string; body: string }[] = [
  {
    title: '🍑 Seu plano te espera!',
    body: 'Você está a um passo de ter o treino perfeito para o seu bumbum. Vamos começar?',
  },
  {
    title: '🔥 Resultados reais te aguardam',
    body: 'Desbloqueie seu programa completo e comece a transformação hoje.',
  },
  {
    title: '💜 Feito para o seu corpo',
    body: 'Seu plano personalizado está pronto. Não deixa ele esperando!',
  },
  {
    title: '⏳ Oferta especial para você',
    body: 'Seu acesso completo ainda está disponível. Garanta agora!',
  },
  {
    title: '💪 A consistência faz a diferença',
    body: 'Centenas de mulheres já transformaram o bumbum com o BumUp. Você é a próxima?',
  },
  {
    title: '🌟 Não deixa pra amanhã',
    body: 'Cada dia conta. Comece hoje e veja os resultados em semanas!',
  },
  {
    title: '🍑 Saudade de você!',
    body: 'Seu programa está esperando. Volte e retome sua jornada!',
  },
];

// Intervalos em segundos entre cada notificação do ciclo
const CYCLE_INTERVALS_SECONDS = [
  1  * 60 * 60,  // 1h
  6  * 60 * 60,  // 6h depois
  24 * 60 * 60,  // 24h depois
  48 * 60 * 60,  // 48h depois
  72 * 60 * 60,  // 72h depois
  7  * 24 * 60 * 60, // 7 dias depois
];

// ─── Permissão ────────────────────────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Agendar ciclo completo ───────────────────────────────────────────────────
// Chama ao chegar no paywall (ou ao abrir o app sem assinatura)
export async function scheduleConversionCycle(): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  // Cancela ciclo anterior se existir
  await cancelConversionCycle();

  const scheduledIds: string[] = [];
  let accumulatedSeconds = 0;

  for (let i = 0; i < CYCLE_INTERVALS_SECONDS.length; i++) {
    accumulatedSeconds += CYCLE_INTERVALS_SECONDS[i];
    const msg = CYCLE_MESSAGES[i % CYCLE_MESSAGES.length];
    const id = `conversion_cycle_${i}`;

    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: msg.title,
        body: msg.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: accumulatedSeconds,
        repeats: false,
      },
    });

    scheduledIds.push(id);
  }

  await storage.setItem(KEY_SCHEDULED_IDS, JSON.stringify(scheduledIds));
}

// ─── Cancelar ciclo (chamar ao assinar) ───────────────────────────────────────
export async function cancelConversionCycle(): Promise<void> {
  try {
    const raw = await storage.getItem(KEY_SCHEDULED_IDS);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      await Promise.all(ids.map(id =>
        Notifications.cancelScheduledNotificationAsync(id).catch(() => {})
      ));
    }
  } catch (_) {}

  // Cancela também por força qualquer id do ciclo
  for (let i = 0; i < CYCLE_INTERVALS_SECONDS.length; i++) {
    await Notifications.cancelScheduledNotificationAsync(`conversion_cycle_${i}`).catch(() => {});
  }

  await storage.removeItem(KEY_SCHEDULED_IDS);
  await storage.removeItem(KEY_CYCLE_INDEX);
}

// ─── Inatividade pós-assinatura ───────────────────────────────────────────────
// Reagendado toda vez que o app abre — timer reinicia do zero
export async function scheduleInactivityReminders(): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.cancelScheduledNotificationAsync('inactive_3d').catch(() => {});
  await Notifications.cancelScheduledNotificationAsync('inactive_7d').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'inactive_3d',
    content: {
      title: '🍑 Saudade de você!',
      body: 'Faz 3 dias que você não treina. Que tal voltar hoje com 15 minutinhos?',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3 * 24 * 60 * 60,
      repeats: false,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: 'inactive_7d',
    content: {
      title: '💪 Não deixa a consistência escapar!',
      body: 'Uma semana sem treino. Volte agora e retome seus resultados!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 7 * 24 * 60 * 60,
      repeats: false,
    },
  });
}

// ─── Lembrete diário de treino (opt-in) ───────────────────────────────────────
export async function scheduleDailyWorkoutReminder(hour = 18, minute = 0): Promise<void> {
  if (Platform.OS === 'web') return;
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.cancelScheduledNotificationAsync('daily_reminder').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily_reminder',
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
  await Notifications.cancelScheduledNotificationAsync('daily_reminder').catch(() => {});
}

// ─── Cancelar tudo ────────────────────────────────────────────────────────────
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Listener de tap na notificação ─────────────────────────────────────────
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void,
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
