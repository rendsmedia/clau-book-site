<?php
/**
 * williammatovu.com: contact form handler.
 * Emails each enquiry, then sends the visitor back to the contact section with
 * a success or error message. Stores nothing.
 *
 * Settings live in a file OUTSIDE the website folder and outside this repo:
 *   /home/rends/wm-mail-config.php
 *   <?php return [
 *     'to'         => 'hello@williammatovu.com',   // where enquiries go (optional)
 *     'script_url' => 'https://script.google.com/macros/s/.../exec',
 *     'secret'     => '...',
 *   ];
 * Without the file, the server's own mail() is used.
 */

const DEFAULT_TO   = 'hello@williammatovu.com';
const FROM_ADDRESS = 'website@williammatovu.com';
const CONFIG_FILE  = '/home/rends/wm-mail-config.php';
const MIN_SECONDS  = 3;   // humans take longer than this to fill the form

function back(string $result): void {
    header('Location: /contact' . ($result !== '' ? '?' . $result : '') . '#form', true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    back('');
}

// Strip line breaks from single-line fields so they can't inject email headers.
function line(string $key, int $max): string {
    $v = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    $v = trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
    return mb_substr($v, 0, $max);
}
function block(string $key, int $max): string {
    $v = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    return mb_substr(trim(str_replace("\r\n", "\n", $v)), 0, $max);
}

// Spam checks: hidden field filled, or form sent impossibly fast. Pretend success so bots learn nothing.
$started = (int) line('started', 20);
if (line('website', 200) !== '' || ($started > 0 && (time() - intdiv($started, 1000)) < MIN_SECONDS)) {
    back('sent=1');
}

$types = [
    'advisory' => 'Advisory for a project or institution',
    'training' => 'Training or a workshop',
    'speaking' => 'Speaking, a panel or a lecture',
    'bulk'     => 'Bulk book order',
    'media'    => 'Media or interview',
    'other'    => 'Something else',
];

$name    = line('name', 120);
$org     = line('organisation', 160);
$email   = line('email', 160);
$phone   = line('phone', 40);
$typeKey = line('enquiry', 20);
$message = block('message', 5000);

if ($name === '' || $message === '' || !isset($types[$typeKey]) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    back('error=1');
}
$type = $types[$typeKey];

$body = implode("\n", [
    "New enquiry from williammatovu.com",
    "",
    "Name:          $name",
    "Organisation:  " . ($org !== '' ? $org : '-'),
    "Email:         $email",
    "Phone:         " . ($phone !== '' ? $phone : '-'),
    "Enquiry:       $type",
    "",
    "Message:",
    $message,
    "",
    "Reply directly to this email to answer $name.",
]);
$subject = "Website enquiry: $type" . ($org !== '' ? " - $org" : " - $name");

$cfg = is_file(CONFIG_FILE) ? include CONFIG_FILE : [];
$cfg = is_array($cfg) ? $cfg : [];
$to  = (!empty($cfg['to']) && filter_var($cfg['to'], FILTER_VALIDATE_EMAIL)) ? $cfg['to'] : DEFAULT_TO;

// Preferred route: a small Google Apps Script that emails the enquiry over HTTPS
// (the host intercepts outgoing SMTP). See tools/contact-form-google-script.gs.
if (!empty($cfg['script_url'])) {
    back(script_send($cfg, $to, $subject, $body, $email) ? 'sent=1' : 'error=1');
}

// Fallback: the server's own mail system.
$headers = implode("\r\n", [
    'From: William Matovu Website <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
]);
$ok = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . FROM_ADDRESS);
back($ok ? 'sent=1' : 'error=1');

/** Post the enquiry to the Google Apps Script web app. Logs failures (never enquiry content). */
function script_send(array $cfg, string $to, string $subject, string $body, string $replyTo): bool {
    $log = '/home/rends/wm-mail.log';
    $payload = json_encode([
        'secret' => (string) ($cfg['secret'] ?? ''), 'to' => $to,
        'subject' => $subject, 'body' => $body, 'replyTo' => $replyTo,
    ]);
    $resp = false; $err = '';
    if (function_exists('curl_init')) {
        $ch = curl_init((string) $cfg['script_url']);
        curl_setopt_array($ch, [
            CURLOPT_POST => true, CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => 25,
        ]);
        $resp = curl_exec($ch);
        if ($resp === false) $err = curl_error($ch);
        curl_close($ch);
    } else {
        $resp = @file_get_contents((string) $cfg['script_url'], false, stream_context_create(['http' => [
            'method' => 'POST', 'header' => "Content-Type: application/json\r\n", 'content' => $payload, 'timeout' => 25,
        ]]));
        if ($resp === false) { $e = error_get_last(); $err = $e ? $e['message'] : 'request failed'; }
    }
    if (is_string($resp) && trim($resp) === 'ok') return true;
    @file_put_contents($log, date('c') . ' script: ' . ($err !== '' ? $err : substr(preg_replace('/\s+/', ' ', strip_tags((string) $resp)), 0, 300)) . "\n", FILE_APPEND);
    return false;
}
