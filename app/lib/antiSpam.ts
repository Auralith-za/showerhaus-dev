/**
 * Anti-Spam Protection Module for Shower Haus Forms
 * 
 * Implements a multi-layered defense system:
 * 1. Multi-Honeypot Trap (detects bots filling hidden inputs)
 * 2. Dynamic Client JS Token (detects raw HTTP POST scripts)
 * 3. Time-Gate Verification (ensures submission delay is humanly possible > 3.5s)
 * 4. Content Heuristic & Domain Spam Filter
 * 5. Silent Drops (returns success to bots without sending emails)
 */

export function createTimestampToken(
    timestamp: number = Date.now(),
    secret: string = 'showerhaus-anti-spam-salt'
): string {
    const payload = `${timestamp}:${secret}`;
    if (typeof btoa !== 'undefined') {
        return btoa(payload);
    }
    return Buffer.from(payload).toString('base64');
}

export function parseTimestampToken(
    token: string | null,
    secret: string = 'showerhaus-anti-spam-salt'
): number | null {
    if (!token) return null;
    try {
        const decoded = typeof atob !== 'undefined' ? atob(token) : Buffer.from(token, 'base64').toString('utf-8');
        const [tsStr, salt] = decoded.split(':');
        if (salt !== secret) return null;
        const ts = parseInt(tsStr, 10);
        return isNaN(ts) ? null : ts;
    } catch {
        return null;
    }
}

// Known bot spam phrase patterns & suspicious domains
const SPAM_TEXT_PATTERNS = [
    /hobbies is antique-shopping/i,
    /antique-shopping this works great/i,
    /casino/i,
    /poker/i,
    /viagra/i,
    /cialis/i,
    /crypto/i,
    /bitcoin/i,
    /telegram:?/i,
    /whatsapp:?\s*\+/i,
    /seo ranking/i,
    /increase website traffic/i,
    /first page on google/i,
    /guest post/i,
    /backlink/i,
];

// Suspicious spam domains/TLDs commonly used by botnets
const SPAM_EMAIL_DOMAINS = [
    'khlsch.us',
    'mailinator.com',
    'guerrillamail.com',
    '10minutemail.com',
    'tempmail.com',
    'trashmail.com',
];

export interface VerifyFormOptions {
    minSubmissionTimeMs?: number; // Minimum time required to submit (default: 3500ms)
    maxSubmissionTimeMs?: number; // Maximum allowed age of form (default: 24h)
    secret?: string;
}

export interface VerificationResult {
    isSpam: boolean;
    reason?: string;
}

export function verifyFormSubmission(
    formData: FormData,
    options: VerifyFormOptions = {}
): VerificationResult {
    const minTime = options.minSubmissionTimeMs ?? 3500;
    const maxTime = options.maxSubmissionTimeMs ?? 86400000;
    const secret = options.secret || 'showerhaus-anti-spam-salt';

    // 1. Honeypot check
    const honeypot1 = formData.get('companyName') as string; // existing honeypot
    const honeypot2 = formData.get('website_url') as string; // secondary honeypot
    const honeypot3 = formData.get('confirm_email_address') as string; // tertiary honeypot

    if (honeypot1 || honeypot2 || honeypot3) {
        return { isSpam: true, reason: 'Honeypot field filled' };
    }

    // 2. Client JS Token check
    const jsVerified = formData.get('js_verified') as string;
    if (!jsVerified || !jsVerified.startsWith('sh_js_ok')) {
        return { isSpam: true, reason: 'Missing or invalid JS verification token' };
    }

    // 3. Time-gate check
    const formTimeToken = formData.get('form_time_token') as string;
    if (!formTimeToken) {
        return { isSpam: true, reason: 'Missing form timestamp token' };
    }

    const startTimestamp = parseTimestampToken(formTimeToken, secret);
    if (!startTimestamp) {
        return { isSpam: true, reason: 'Invalid form timestamp token' };
    }

    const now = Date.now();
    const elapsedTime = now - startTimestamp;

    if (elapsedTime < minTime) {
        return { isSpam: true, reason: `Submission too fast (${elapsedTime}ms)` };
    }

    if (elapsedTime > maxTime) {
        return { isSpam: true, reason: `Form token expired (${elapsedTime}ms)` };
    }

    // 4. Content Heuristics & Spam Filter
    const email = (formData.get('email') as string || '').toLowerCase().trim();
    const message = formData.get('message') as string || formData.get('notes') as string || '';
    const firstName = formData.get('firstName') as string || '';
    const lastName = formData.get('lastName') as string || '';

    // Check email domain against known spam domains
    const emailDomain = email.split('@')[1] || '';
    if (SPAM_EMAIL_DOMAINS.includes(emailDomain)) {
        return { isSpam: true, reason: `Blacklisted email domain (${emailDomain})` };
    }

    // Check message content against spam patterns
    const combinedText = `${firstName} ${lastName} ${message}`.toLowerCase();

    for (const pattern of SPAM_TEXT_PATTERNS) {
        if (pattern.test(combinedText) || pattern.test(message)) {
            return { isSpam: true, reason: `Spam text pattern matched: ${pattern}` };
        }
    }

    // Count URLs in message (more than 2 URLs in a contact message is usually spam)
    const urlMatches = message.match(/https?:\/\/[^\s]+/g);
    if (urlMatches && urlMatches.length > 2) {
        return { isSpam: true, reason: 'Excessive URLs in message' };
    }

    return { isSpam: false };
}
