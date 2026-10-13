# Ghana Transfer Guide — International Transfers to Ghana

Responsive static website built with HTML5, CSS3 and vanilla JavaScript. The project now includes a transfer finder, an opt-in public recipient-directory demo, and a private recipient checklist.

## Files
- `index.html` — semantic page structure, transfer finder, provider links, public directory, private recipient entry, registration form, FAQs and contact information.
- `style.css` — responsive styling for desktop, tablet and mobile, focus states, form controls and reduced-motion support.
- `script.js` — searchable sending-country selection, provider checklists, copy controls, in-session public profile previews, public-directory filters, private checklist generation, and mobile navigation.

## Run locally
1. Extract the ZIP file.
2. Open the `international-transfer` folder in Visual Studio Code.
3. Open `index.html` in your browser, or use the VS Code Live Server extension.
4. Use a local server or HTTPS for best clipboard support.

## Important implementation limits
This is a front-end prototype, not a live registration service or payment platform.
- Public profiles created with the registration form are held in JavaScript memory only. They appear in the directory for the current page session and disappear when the page is refreshed. They are not shared with other visitors or uploaded to a server.
- The private recipient form builds a checklist in the current page only. It does not send or persist those details.
- The provider finder does not verify live route availability, calculate live fees/rates, initiate transfers, or confirm payment.

## Before public launch
A real public directory needs a secure backend and database, server-side validation, abuse/spam protection, a way for people to remove their profiles, explicit consent records, a privacy notice and terms, moderation/reporting, and suitable access controls. Do not store recipient phone numbers, wallet numbers, bank details or sensitive identity data in public profile records. Use a reputable backend service and avoid putting admin keys or API secrets in browser-side JavaScript.

Also verify official provider links, supported sender-country routes and payout methods, and replace generic social-media homepage URLs with verified profile links. Deploy only over HTTPS. Static hosting options include GitHub Pages, Netlify and Cloudflare Pages.

## Safety
The site never asks for a Mobile Money PIN, OTP, provider password, card number or banking credentials. Visitors must complete transfers on the remittance provider's official platform. This independent directory is not affiliated with MTN or any transfer provider.
