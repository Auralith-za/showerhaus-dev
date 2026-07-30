import { createTimestampToken, verifyFormSubmission } from '../app/lib/antiSpam.ts';

console.log('--- AntiSpam Test Suite ---');

function makeFormData(obj) {
    const fd = new Map();
    for (const [k, v] of Object.entries(obj)) {
        fd.set(k, v);
    }
    return {
        get(key) {
            return fd.get(key) || null;
        }
    };
}

const secret = 'test-secret-salt';

// Test 1: Real human submission (valid JS token, valid timestamp, no honeypots, clean message)
const validTimeToken = createTimestampToken(Date.now() - 5000, secret); // 5 seconds ago
const validSubmission = makeFormData({
    form_time_token: validTimeToken,
    js_verified: 'sh_js_ok_12345678',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    message: 'Hello, I would like to inquire about a custom frameless shower enclosure.'
});
const res1 = verifyFormSubmission(validSubmission, { secret });
console.log('Test 1 (Real Human):', res1.isSpam === false ? 'PASSED (Allowed)' : `FAILED: ${res1.reason}`);

// Test 2: Spam Bot with Honeypot field filled
const honeypotSubmission = makeFormData({
    form_time_token: validTimeToken,
    js_verified: 'sh_js_ok_12345678',
    companyName: 'Bot Inc',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    message: 'Test message'
});
const res2 = verifyFormSubmission(honeypotSubmission, { secret });
console.log('Test 2 (Honeypot Trap):', res2.isSpam === true ? `PASSED (Blocked: ${res2.reason})` : 'FAILED');

// Test 3: Raw cURL / Script POST without JS Token
const noJsSubmission = makeFormData({
    form_time_token: validTimeToken,
    firstName: 'Bot',
    lastName: 'Script',
    email: 'bot@example.com',
    message: 'Hello'
});
const res3 = verifyFormSubmission(noJsSubmission, { secret });
console.log('Test 3 (No JS Token):', res3.isSpam === true ? `PASSED (Blocked: ${res3.reason})` : 'FAILED');

// Test 4: Too Fast Submission (< 3.5s)
const fastTimeToken = createTimestampToken(Date.now() - 500, secret); // 500ms ago
const fastSubmission = makeFormData({
    form_time_token: fastTimeToken,
    js_verified: 'sh_js_ok_12345678',
    firstName: 'Fast',
    lastName: 'Bot',
    email: 'fast@example.com',
    message: 'Too fast submission'
});
const res4 = verifyFormSubmission(fastSubmission, { secret });
console.log('Test 4 (Submission < 3.5s):', res4.isSpam === true ? `PASSED (Blocked: ${res4.reason})` : 'FAILED');

// Test 5: Exact Spam Bot pattern from User Screenshot ("elitabenjamin93nym@khlsch.us", "one of my hobbies is antique-shopping...")
const userSpamSample = makeFormData({
    form_time_token: validTimeToken,
    js_verified: 'sh_js_ok_12345678',
    firstName: 'Sidney',
    lastName: 'Botsford',
    email: 'elitabenjamin93nym@khlsch.us',
    message: "one of my hobbies is antique-shopping. and when i'm antique-shopping this works great."
});
const res5 = verifyFormSubmission(userSpamSample, { secret });
console.log('Test 5 (User Spam Screenshot Sample):', res5.isSpam === true ? `PASSED (Blocked: ${res5.reason})` : 'FAILED');

console.log('--- All AntiSpam Tests Finished ---');
