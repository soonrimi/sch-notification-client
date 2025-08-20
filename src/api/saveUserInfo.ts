import type { Major } from '@/types/profile';

export async function saveUserInfo(info: Major[]) {
  const res = await fetch('/api/user/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ info }),
  });

  if (!res.ok) {
    throw new Error('Failed to save user info');
  }

  return res.json();
}
