// Simple client-side admin auth (demo). Password is stored in localStorage.
// NOTE: Not secure for production — anyone with browser access can read it.

const PASSWORD_KEY = 'matcha_admin_password';
const SESSION_KEY = 'matcha_admin_auth';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';

export function getAdminPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_PASSWORD;
}

export function setAdminPassword(newPassword: string): void {
  localStorage.setItem(PASSWORD_KEY, newPassword);
}

export function checkAdminCredentials(username: string, password: string): boolean {
  return username === DEFAULT_USERNAME && password === getAdminPassword();
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function setAdminAuthenticated(): void {
  sessionStorage.setItem(SESSION_KEY, '1');
}

export function clearAdminAuthenticated(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export const ADMIN_USERNAME = DEFAULT_USERNAME;
