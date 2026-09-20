export interface Stamp {
  id: string;
  name: string;
  theme: 'pink' | 'peach' | 'mint' | 'sage';
  imageUrl: string;
  denomination: string;
  postmarkText: string;
  description: string;
}

export interface Letter {
  id: string;
  title?: string;
  content: string;
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  stampId: string;
  date: string;
  location?: string;
  isSpecial?: boolean;
  envelopeColor?: 'pink' | 'peach' | 'mint' | 'cream';
  waxSeal?: 'heart' | 'rose' | 'shell' | 'star';
  fontStyle?: 'cursive' | 'serif' | 'typewriter';
  paperTexture?: 'cream' | 'pink' | 'peach' | 'mint';
  likesCount?: number;
  authorType?: 'human' | 'ai';
  isRealUser?: boolean;
  paymentAmount?: number;
  paymentRecipient?: string;
  utrNumber?: string;
  authorToken?: string;
}

export interface AuthoredLetterRecord {
  id: string;
  deleteToken: string;
  title: string;
  date: string;
}
