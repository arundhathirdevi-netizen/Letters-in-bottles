import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { Letter } from './src/types';

const CREATOR_GPAY_PHONE = '+91 99471 17171';
const CREATOR_GPAY_ACCOUNT = '+91 99471 17171 (Google Pay)';
const CREATOR_ACCOUNT_EMAIL = process.env.CREATOR_ACCOUNT_EMAIL || 'arundhathi.r.devi@gmail.com';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  const dataDir = path.join(process.cwd(), 'data');
  const collectionFilePath = path.join(dataDir, 'letters_collection.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load human letters collection only - strictly no AI seed letters, and purge trial "dearest" letters
  let lettersCollection: Letter[] = [];
  try {
    if (fs.existsSync(collectionFilePath)) {
      const rawData = fs.readFileSync(collectionFilePath, 'utf-8');
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        // Filter out seed letters, AI letters, and any trial dearest test letters
        lettersCollection = parsed.filter((l: Letter) => {
          const isSeedOrAi = l.id?.startsWith('bottle-seed') || l.authorType === 'ai';
          const isTrialDearest =
            l.recipientName?.toLowerCase().includes('dearest') ||
            l.title?.toLowerCase().includes('dearest') ||
            l.content?.toLowerCase().includes('dearest') ||
            l.id?.includes('trial');
          return !isSeedOrAi && !isTrialDearest;
        });
      }
    }
  } catch (err) {
    console.error('Failed to read collection file:', err);
    lettersCollection = [];
  }

  const persistCollection = () => {
    try {
      fs.writeFileSync(collectionFilePath, JSON.stringify(lettersCollection, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting letters collection:', err);
    }
  };

  // Persist cleaned collection immediately
  persistCollection();

  // Helper: Dispatch letter email to loved one's mailbox
  async function dispatchEmailToLovedOne(letter: Letter, secretLinkUrl: string) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpFrom = process.env.SMTP_FROM || `Letters in Bottles <no-reply@lettersinbottles.com>`;

    const senderDisplay = letter.senderName || 'Someone who loves you';
    const recipientDisplay = letter.recipientName || 'Beloved';

    // Formatted mailto link for direct sending from user's email client
    const mailtoSubject = encodeURIComponent(`💌 A sealed letter for you from ${senderDisplay}`);
    const mailtoBody = encodeURIComponent(
      `Dear ${recipientDisplay},\n\n` +
      `I wrote you a letter sealed in a digital bottle.\n\n` +
      `"${letter.content}"\n\n` +
      `---\n` +
      `Uncork & view your private sealed envelope on the shore:\n${secretLinkUrl}\n\n` +
      `With warm thoughts,\n${senderDisplay}`
    );
    const mailtoUrl = `mailto:${encodeURIComponent(letter.recipientEmail || '')}?subject=${mailtoSubject}&body=${mailtoBody}`;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(`[Email Dispatch] SMTP credentials not set. Returning mailto and preview for ${letter.recipientEmail}.`);
      return {
        sent: false,
        reason: 'smtp_not_configured',
        mailtoUrl,
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const htmlContent = `
        <div style="background-color: #161210; padding: 40px 16px; font-family: 'Georgia', serif; color: #fdfaf6; text-align: center;">
          <div style="max-width: 580px; margin: 0 auto; background: #fdfaf3; border: 1px solid #dfd3c3; border-radius: 12px; padding: 36px 28px; color: #2a201a; box-shadow: 0 8px 30px rgba(0,0,0,0.25);">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #a46d5c; margin-bottom: 12px; font-weight: 600;">
              ✨ Handmade Letter in a Bottle ✨
            </div>
            <h1 style="font-size: 26px; font-weight: normal; margin-top: 0; color: #221812; line-height: 1.3;">
              A sealed letter has arrived for ${recipientDisplay}
            </h1>
            <p style="font-style: italic; color: #7a6356; font-size: 14px; margin-bottom: 24px;">
              Carried across the digital ocean from ${senderDisplay}
            </p>
            
            <div style="background-color: #f7f0e6; border: 1px dashed #d5bead; border-radius: 8px; padding: 24px 20px; margin: 24px 0; font-size: 16px; line-height: 1.8; white-space: pre-wrap; text-align: left; color: #2e231c;">
${letter.content}
            </div>

            <div style="margin-top: 28px; margin-bottom: 20px;">
              <a href="${secretLinkUrl}" style="display: inline-block; background-color: #2b1f1a; color: #fdfaf6; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; letter-spacing: 1px; font-weight: 500;">
                Uncork & View Sealed Letter 💌
              </a>
            </div>

            <p style="font-size: 12px; color: #9c8a80; margin-top: 24px; border-top: 1px solid #ebd8c8; padding-top: 16px;">
              Sealed with care • Delivered via Letters in Bottles to ${letter.recipientEmail}
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: smtpFrom,
        to: letter.recipientEmail,
        replyTo: letter.senderEmail || undefined,
        subject: `💌 A sealed letter for you from ${senderDisplay}`,
        text: `Dear ${recipientDisplay},\n\nYou have received a sealed letter from ${senderDisplay}:\n\n"${letter.content}"\n\nOpen your bottle online: ${secretLinkUrl}`,
        html: htmlContent,
      });

      console.log(`[Email Dispatch] Successfully sent email to ${letter.recipientEmail}`);
      return { sent: true, mailtoUrl };
    } catch (sendErr) {
      console.error('[Email Dispatch] Failed to send email via SMTP:', sendErr);
      return { sent: false, error: String(sendErr), mailtoUrl };
    }
  }

  // API: Creator receiving account info
  app.get('/api/creator-account', (_req, res) => {
    res.json({
      success: true,
      creatorAccountEmail: CREATOR_ACCOUNT_EMAIL,
      paypalMeLink: `https://www.paypal.com/paypalme/`,
    });
  });

  // API 1: Get full ocean collection (only public letters written by real people - NEVER letters sent to loved ones)
  app.get('/api/letters', (_req, res) => {
    // Only return public letters; letters sent to loved ones are private and never available in the public ocean
    const publicLetters = lettersCollection.filter(
      (l) => !l.id.startsWith('bottle-seed') && l.authorType !== 'ai' && !l.isSpecial
    );
    res.json({
      success: true,
      letters: publicLetters,
      totalCount: publicLetters.length,
    });
  });

  // API 2: Get a random letter from the public ocean (NEVER letters sent to loved ones)
  app.get('/api/letters/random', (_req, res) => {
    const publicLetters = lettersCollection.filter(
      (l) => !l.id.startsWith('bottle-seed') && l.authorType !== 'ai' && !l.isSpecial
    );
    if (publicLetters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No public letters drifting in the ocean yet.',
      });
    }
    const randomIndex = Math.floor(Math.random() * publicLetters.length);
    const randomLetter = publicLetters[randomIndex];
    res.json({
      success: true,
      letter: randomLetter,
      index: randomIndex,
      totalCount: publicLetters.length,
    });
  });

  // API 2.5: Get a private sealed letter sent to a loved one (accessible ONLY by the loved one with bottle ID)
  app.get('/api/letters/private/:id', (req, res) => {
    const { id } = req.params;
    const letter = lettersCollection.find((l) => l.id === id);
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Private sealed letter not found.' });
    }
    res.json({ success: true, letter });
  });

  // API 3: Save letter written by real people into the ocean collection
  app.post('/api/letters', (req, res) => {
    try {
      const incoming = req.body;
      if (!incoming || !incoming.content || typeof incoming.content !== 'string' || incoming.content.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Letter content cannot be empty.' });
      }

      const authorToken =
        incoming.authorToken?.trim() ||
        `auth-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

      const newLetter: Letter = {
        id: incoming.id || `bottle-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: incoming.title?.trim() || 'A gentle whisper',
        content: incoming.content.trim(),
        senderName: incoming.senderName?.trim() || 'A quiet soul',
        senderEmail: incoming.senderEmail?.trim() || '',
        recipientName: incoming.recipientName?.trim() || 'A Wandering Soul',
        recipientEmail: incoming.recipientEmail?.trim() || '',
        stampId: incoming.stampId || 'baby-rose',
        date: incoming.date || 'Floating today',
        location: incoming.location?.trim() || 'From somewhere across the sea',
        isSpecial: Boolean(incoming.isSpecial),
        envelopeColor: incoming.envelopeColor || 'cream',
        waxSeal: incoming.waxSeal || 'heart',
        fontStyle: incoming.fontStyle || 'cursive',
        paperTexture: incoming.paperTexture || 'cream',
        likesCount: Number(incoming.likesCount) || 1,
        authorType: 'human', // Strictly human
        isRealUser: true,
        paymentAmount: incoming.paymentAmount ? Number(incoming.paymentAmount) : undefined,
        paymentRecipient: CREATOR_GPAY_ACCOUNT,
        authorToken,
      };

      lettersCollection.unshift(newLetter);
      persistCollection();

      console.log(`[Collection] Saved letter "${newLetter.title}" by human. Total: ${lettersCollection.length}`);

      res.status(201).json({
        success: true,
        letter: newLetter,
        totalCount: lettersCollection.length,
        paymentRecipient: CREATOR_GPAY_ACCOUNT,
      });
    } catch (err: any) {
      console.error('Failed to save letter to collection:', err);
      res.status(500).json({ success: false, message: err?.message || 'Failed to save letter.' });
    }
  });

  // API 4: Send letter to a loved one's mailbox (Option B) - payment to Google Pay +91 99471 17171
  app.post('/api/letters/send-to-loved-one', async (req, res) => {
    try {
      const { letter, secretLinkUrl, paymentTier } = req.body;
      if (!letter || !letter.content) {
        return res.status(400).json({ success: false, message: 'Letter content is required.' });
      }
      if (!letter.senderEmail || !letter.senderEmail.includes('@')) {
        return res.status(400).json({ success: false, message: 'Your email address is required so your loved one knows who sent the letter.' });
      }
      if (!letter.recipientEmail || !letter.recipientEmail.includes('@')) {
        return res.status(400).json({ success: false, message: "Your loved one's email address is required to send the letter directly to them." });
      }

      const authorToken =
        letter.authorToken?.trim() ||
        `auth-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

      const newLetter: Letter = {
        id: letter.id || `secret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: letter.title?.trim() || 'A sealed letter for you',
        content: letter.content.trim(),
        senderName: letter.senderName?.trim() || 'Someone who loves you',
        senderEmail: letter.senderEmail?.trim() || '',
        recipientName: letter.recipientName?.trim() || 'Beloved',
        recipientEmail: letter.recipientEmail.trim(),
        stampId: letter.stampId || 'baby-rose',
        date: letter.date || 'Sealed today with care',
        location: letter.location?.trim() || 'From a fond heart',
        isSpecial: true,
        envelopeColor: letter.envelopeColor || 'pink',
        waxSeal: letter.waxSeal || 'heart',
        fontStyle: letter.fontStyle || 'cursive',
        paperTexture: letter.paperTexture || 'pink',
        likesCount: 1,
        authorType: 'human',
        isRealUser: true,
        paymentAmount: paymentTier ? Number(paymentTier) : 1,
        paymentRecipient: CREATOR_GPAY_ACCOUNT,
        authorToken,
      };

      // Add to letters collection
      lettersCollection.unshift(newLetter);
      persistCollection();

      console.log(`[Special Delivery] Letter created for ${newLetter.recipientEmail}. All payments directed to Google Pay: ${CREATOR_GPAY_PHONE} (${CREATOR_GPAY_ACCOUNT})`);

      // Dispatch email to loved one's mailbox
      const emailResult = await dispatchEmailToLovedOne(newLetter, secretLinkUrl || '');

      res.status(201).json({
        success: true,
        letter: newLetter,
        creatorAccount: CREATOR_GPAY_ACCOUNT,
        gpayAccount: CREATOR_GPAY_ACCOUNT,
        gpayPhone: CREATOR_GPAY_PHONE,
        emailDispatched: emailResult.sent,
        mailtoUrl: emailResult.mailtoUrl,
      });
    } catch (err: any) {
      console.error('Failed to dispatch letter to loved one:', err);
      res.status(500).json({ success: false, message: err?.message || 'Failed to dispatch letter.' });
    }
  });

  // API 4.5: Purge trial letters (e.g. test dearest letters)
  app.post('/api/letters/purge-trial', (_req, res) => {
    const beforeCount = lettersCollection.length;
    lettersCollection = lettersCollection.filter((l) => {
      const isDearestTrial =
        l.recipientName?.toLowerCase().includes('dearest') ||
        l.title?.toLowerCase().includes('dearest') ||
        l.content?.toLowerCase().includes('dearest') ||
        l.id?.includes('trial');
      return !isDearestTrial;
    });
    persistCollection();
    const purged = beforeCount - lettersCollection.length;
    console.log(`[Purge] Trial dearest letters purged: ${purged} removed, ${lettersCollection.length} remaining.`);
    res.json({
      success: true,
      purgedCount: purged,
      remainingCount: lettersCollection.length,
      message: 'Trial dearest letter has been successfully deleted from the ocean collection.',
    });
  });

  // API 5: Like a letter
  app.post('/api/letters/:id/like', (req, res) => {
    const { id } = req.params;
    const target = lettersCollection.find((l) => l.id === id);
    if (target) {
      target.likesCount = (target.likesCount || 0) + 1;
      persistCollection();
      return res.json({ success: true, likesCount: target.likesCount });
    }
    res.status(404).json({ success: false, message: 'Letter not found' });
  });

  // API 6: Delete letter - ONLY the author who wrote it can delete it
  app.delete('/api/letters/:id', (req, res) => {
    try {
      const { id } = req.params;
      const deleteToken =
        (req.headers['x-delete-token'] as string) ||
        req.body?.deleteToken ||
        (req.query?.deleteToken as string);

      const targetIndex = lettersCollection.findIndex((l) => l.id === id);
      if (targetIndex === -1) {
        return res.status(404).json({ success: false, message: 'Letter not found in ocean.' });
      }

      const letter = lettersCollection[targetIndex];

      // Strict security: ONLY author who possesses the authorToken can delete
      if (letter.authorToken) {
        if (!deleteToken || deleteToken !== letter.authorToken) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Only the person who wrote this letter can delete it.',
          });
        }
      }

      // Remove from collection
      lettersCollection.splice(targetIndex, 1);
      persistCollection();

      console.log(`[Collection] Letter ${id} permanently deleted by its author.`);
      return res.json({
        success: true,
        message: 'Your letter has been withdrawn and dissolved from the ocean.',
        remainingCount: lettersCollection.length,
      });
    } catch (err: any) {
      console.error('Failed to delete letter:', err);
      res.status(500).json({ success: false, message: 'Failed to delete letter.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ocean server running on port ${PORT}. Creator Account: ${CREATOR_ACCOUNT_EMAIL}`);
  });
}

startServer();
