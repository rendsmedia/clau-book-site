/**
 * williammatovu.com: contact form mailer (Google Apps Script).
 * The website posts each enquiry here; this script emails it.
 *
 * Setup (once):
 * 1. script.google.com → New project, paste this file, set SECRET to a long random string.
 * 2. Run authorize() once and accept the permission to send email.
 * 3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone. Copy the /exec URL.
 * 4. On the server, create /home/rends/wm-mail-config.php (outside public_html):
 *      <?php return ['to' => 'hello@williammatovu.com', 'script_url' => 'PASTE /exec URL', 'secret' => 'SAME SECRET'];
 *    Until hello@williammatovu.com has a working mailbox, set 'to' to an inbox that already works.
 */
const SECRET = 'PASTE-THE-SECRET-HERE';
const ALLOWED_TO = ['hello@williammatovu.com', 'business@rendsmedia.com'];

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.secret !== SECRET) return reply('denied');
    const to = ALLOWED_TO.indexOf(String(p.to)) >= 0 ? String(p.to) : ALLOWED_TO[0];
    MailApp.sendEmail({
      to: to,
      subject: String(p.subject || 'Website enquiry').slice(0, 200),
      body: String(p.body || '').slice(0, 20000),
      replyTo: String(p.replyTo || ''),
      name: 'William Matovu Website'
    });
    return reply('ok');
  } catch (err) {
    return reply('error: ' + err);
  }
}

function reply(text) {
  return ContentService.createTextOutput(text);
}

// Run this once from the editor to grant permission to send email.
function authorize() {
  MailApp.getRemainingDailyQuota();
}
