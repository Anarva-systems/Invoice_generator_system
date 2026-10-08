import type { ActiveTemplate } from '../types/invoice';

const SERIAL_STORAGE_KEYS: Record<ActiveTemplate, string> = {
  valuation: 'valuation_serial_no',
  construction: 'construction_serial_no',
};

const PENDING_INCREMENT_KEYS: Record<ActiveTemplate, string> = {
  valuation: 'pending_increment_valuation',
  construction: 'pending_increment_construction',
};

/**
 * Retrieves the current serial number. If a download was previously completed
 * and an increment was pending, it advances the count by +1, persists it,
 * and clears the pending flag upon this refresh/reload.
 */
export function getAndConsumeSerial(template: ActiveTemplate, defaultVal: string): string {
  const serialKey = SERIAL_STORAGE_KEYS[template];
  const pendingKey = PENDING_INCREMENT_KEYS[template];

  const storedSerial = localStorage.getItem(serialKey) || defaultVal;
  const isPending = localStorage.getItem(pendingKey) === 'true';

  if (isPending) {
    const currentNum = parseInt(storedSerial, 10);
    const nextNum = !isNaN(currentNum) ? String(currentNum + 1) : defaultVal;
    localStorage.setItem(serialKey, nextNum);
    localStorage.removeItem(pendingKey);
    return nextNum;
  }

  return storedSerial;
}

/**
 * Flags that the current invoice was generated/downloaded, arming the auto-increment
 * to advance the serial count on the next page refresh or session reload.
 */
export function markPendingIncrement(template: ActiveTemplate): void {
  const pendingKey = PENDING_INCREMENT_KEYS[template];
  localStorage.setItem(pendingKey, 'true');
}

/**
 * Checks whether an auto-increment is currently queued for the next refresh.
 */
export function hasPendingIncrement(template: ActiveTemplate): boolean {
  const pendingKey = PENDING_INCREMENT_KEYS[template];
  return localStorage.getItem(pendingKey) === 'true';
}

/**
 * Persists the current serial number to localStorage.
 */
export function saveSerial(template: ActiveTemplate, serial: string): void {
  const serialKey = SERIAL_STORAGE_KEYS[template];
  localStorage.setItem(serialKey, serial);
}

/**
 * Immediately increments the serial number by +1 and saves it.
 */
export function incrementSerialNow(template: ActiveTemplate, currentSerial: string): string {
  const currentNum = parseInt(currentSerial, 10);
  const nextSerial = !isNaN(currentNum) ? String(currentNum + 1) : currentSerial;
  saveSerial(template, nextSerial);
  return nextSerial;
}
