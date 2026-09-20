import { Letter, AuthoredLetterRecord } from '../types';

export const AUTHORED_STORAGE_KEY = 'my_authored_letters_ocean_v1';

// Get records of letters authored on this device/browser
export function getMyAuthoredLetters(): AuthoredLetterRecord[] {
  try {
    const raw = localStorage.getItem(AUTHORED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Automatically filter out any trial dearest letter
        const cleaned = parsed.filter(
          (r: AuthoredLetterRecord) =>
            !r.title?.toLowerCase().includes('dearest') &&
            !r.id?.toLowerCase().includes('dearest') &&
            !r.id?.includes('trial')
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(AUTHORED_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

// Purge trial dearest letters from client storage and server collection
export async function purgeTrialLetters(): Promise<void> {
  try {
    const localOceanKey = 'letters_in_bottles_ocean_v1';
    const rawOcean = localStorage.getItem(localOceanKey);
    if (rawOcean) {
      const parsed = JSON.parse(rawOcean);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((l: Letter) => {
          const isDearestTrial =
            l.recipientName?.toLowerCase().includes('dearest') ||
            l.title?.toLowerCase().includes('dearest') ||
            l.content?.toLowerCase().includes('dearest') ||
            l.id?.includes('trial');
          return !isDearestTrial;
        });
        localStorage.setItem(localOceanKey, JSON.stringify(cleaned));
      }
    }

    const authored = getMyAuthoredLetters();
    const cleanedAuthored = authored.filter(
      (r) => !r.title?.toLowerCase().includes('dearest') && !r.id?.includes('trial')
    );
    localStorage.setItem(AUTHORED_STORAGE_KEY, JSON.stringify(cleanedAuthored));

    // Inform server to purge any trial dearest letters
    await fetch('/api/letters/purge-trial', { method: 'POST' }).catch(() => {});
  } catch (err) {
    console.warn('Purge trial letters error:', err);
  }
}

// Record an authored letter locally so only this person can delete it
export function saveMyAuthoredLetter(letter: Letter): void {
  try {
    const current = getMyAuthoredLetters();
    const token = letter.authorToken || `auth-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const record: AuthoredLetterRecord = {
      id: letter.id,
      deleteToken: token,
      title: letter.title || 'Untitled Letter',
      date: letter.date || 'Today',
    };
    const updated = [record, ...current.filter((r) => r.id !== letter.id)];
    localStorage.setItem(AUTHORED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// Check if a letter was written by the current user
export function isMyAuthoredLetter(letterId: string): boolean {
  const authored = getMyAuthoredLetters();
  return authored.some((r) => r.id === letterId);
}

// Get the delete token for an authored letter
export function getMyDeleteToken(letterId: string): string | null {
  const authored = getMyAuthoredLetters();
  const match = authored.find((r) => r.id === letterId);
  return match ? match.deleteToken : null;
}

// Remove authored record after successful deletion
export function removeMyAuthoredLetter(letterId: string): void {
  try {
    const current = getMyAuthoredLetters();
    const updated = current.filter((r) => r.id !== letterId);
    localStorage.setItem(AUTHORED_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export async function fetchLettersCollection(): Promise<Letter[] | null> {
  try {
    const res = await fetch('/api/letters');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success && Array.isArray(data.letters)) {
      return data.letters;
    }
  } catch (err) {
    console.warn('Could not fetch letters from server collection, using local storage:', err);
  }
  return null;
}

export async function fetchPrivateLetter(id: string): Promise<Letter | null> {
  try {
    const res = await fetch(`/api/letters/private/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.letter) {
        return data.letter;
      }
    }
  } catch (err) {
    console.warn('Error fetching private letter:', err);
  }
  return null;
}

export async function saveLetterToCollection(letter: Letter): Promise<boolean> {
  try {
    // Remember that this browser authored this letter
    saveMyAuthoredLetter(letter);

    const res = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter),
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Could not persist letter to server collection, saved locally:', err);
  }
  return false;
}

export async function likeLetterInCollection(id: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/letters/${encodeURIComponent(id)}/like`, {
      method: 'POST',
    });
    if (res.ok) {
      const data = await res.json();
      return data?.likesCount ?? null;
    }
  } catch (err) {
    console.warn('Failed to register like on server:', err);
  }
  return null;
}

export async function sendLetterToLovedOneApi(
  letter: Letter,
  secretLinkUrl: string,
  paymentTier: number
): Promise<{ success: boolean; emailDispatched?: boolean; mailtoUrl?: string } | null> {
  try {
    // Remember authorship for Option B letters as well
    saveMyAuthoredLetter(letter);

    const res = await fetch('/api/letters/send-to-loved-one', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter, secretLinkUrl, paymentTier }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error sending letter to loved one email endpoint:', err);
  }
  return null;
}

// Delete a letter - strictly requires the author's delete token
export async function deleteLetterFromCollection(
  id: string,
  deleteToken?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = deleteToken || getMyDeleteToken(id) || '';
    const res = await fetch(`/api/letters/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-delete-token': token,
      },
      body: JSON.stringify({ deleteToken: token }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.success) {
      removeMyAuthoredLetter(id);
      return { success: true, message: data.message || 'Letter dissolved from the ocean.' };
    } else {
      return {
        success: false,
        message: data?.message || 'Only the author who wrote this letter can delete it.',
      };
    }
  } catch (err: any) {
    console.error('Delete letter error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to communicate with ocean archives.',
    };
  }
}
