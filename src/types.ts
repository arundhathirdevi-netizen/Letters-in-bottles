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
  recipientName?: string;
  stampId: string;
  date: string;
  location?: string;
  isSpecial?: boolean;
  envelopeColor?: 'pink' | 'peach' | 'mint' | 'cream';
  waxSeal?: 'heart' | 'rose' | 'shell' | 'star';
  fontStyle?: 'cursive' | 'serif' | 'typewriter';
  paperTexture?: 'cream' | 'pink' | 'peach' | 'mint';
  likesCount?: number;
}
