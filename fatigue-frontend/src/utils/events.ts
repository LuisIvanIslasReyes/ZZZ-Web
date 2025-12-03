/**
 * Custom Event System
 * Sistema simple de eventos para comunicación entre componentes
 */

export const CustomEvents = {
  ALERT_RESOLVED: 'alert:resolved',
  ALERT_CREATED: 'alert:created',
  SYMPTOM_REVIEWED: 'symptom:reviewed',
};

export const dispatchCustomEvent = (eventName: string, detail?: any) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const listenToCustomEvent = (eventName: string, callback: (event: CustomEvent) => void) => {
  window.addEventListener(eventName, callback as EventListener);
  return () => window.removeEventListener(eventName, callback as EventListener);
};
