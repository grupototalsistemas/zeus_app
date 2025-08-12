export type NotificationType = 'silent' | 'desktop';

class NotificationService {
  private type: NotificationType = 'silent';

  setType(type: NotificationType) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações.');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  notify(title: string, body: string, options?: NotificationOptions) {
    if (this.type === 'silent') {
      // Apenas console.log (ou toast in-app se quiser)
      console.log(`🔔 [SILENT] ${title}: ${body}`);
      return;
    }

    if (this.type === 'desktop') {
      if (!('Notification' in window)) {
        console.warn('Notificações não suportadas.');
        return;
      }

      if (Notification.permission === 'granted') {
        new Notification(title, { body, ...options });
      } else {
        console.warn('Permissão de notificação não concedida.');
      }
    }
  }
}

export const notificationService = new NotificationService();
