const BASE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  background: #f4f5f7;
  margin: 0;
  padding: 0;
`;

const WRAPPER = `
  max-width: 600px;
  margin: 0 auto;
  background: #f4f5f7;
`;

const HEADER_BG = `
  background: #1c1f2b;
  border-bottom: 4px solid #F5C518;
  padding: 32px 40px 28px;
  text-align: center;
`;

const LOGO_ROW = `
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const HEADING = `
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
  line-height: 1.2;
`;

const SUBHEADING = `
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  margin: 0;
`;

const SECTION = `
  background: #ffffff;
  border: 1px solid #e2e5ea;
  border-radius: 10px;
  margin: 0 20px 14px;
  overflow: hidden;
`;

const SECTION_LABEL = `
  background: #f0f2f5;
  border-bottom: 1px solid #e2e5ea;
  padding: 8px 18px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8892a0;
`;

const FOOTER = `
  text-align: center;
  padding: 20px 40px 28px;
  font-size: 12px;
  color: #9aa3ad;
  line-height: 1.7;
`;

const CTA_BTN = `
  display: inline-block;
  background: #3B7DEB;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 12px 30px;
  border-radius: 8px;
  margin: 8px 0 24px;
`;

// Stacked row: label band on top, value below — works in all email clients, never clips
const LABEL_BAND = `
  display: block;
  background: #f7f8fa;
  border-bottom: 1px solid #e8eaee;
  padding: 5px 18px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8892a0;
`;

const VALUE_BAND = `
  display: block;
  padding: 10px 18px 13px;
  font-size: 14px;
  color: #1a1f2e;
  font-weight: 500;
  border-bottom: 1px solid #edeef1;
  word-break: break-word;
`;

function fmtDate(d: string | undefined): string | undefined {
  if (!d) return undefined;
  const [y, m, day] = d.split('-');
  if (!y || !m || !day) return d;
  return `${m}/${day}/${y}`;
}

function row(label: string, value: string | undefined): string {
  if (!value) return '';
  return `<div>
    <div style="${LABEL_BAND}">${label}</div>
    <div style="${VALUE_BAND}">${value}</div>
  </div>`;
}

function section(title: string, rows: string): string {
  return `<div style="${SECTION}">
    <div style="${SECTION_LABEL}">${title}</div>
    ${rows}
  </div>`;
}

function textSection(title: string, content: string): string {
  return `<div style="${SECTION}">
    <div style="${SECTION_LABEL}">${title}</div>
    <div style="padding:14px 18px 16px;">
      <p style="font-size:14px;color:#2d3340;line-height:1.7;margin:0;word-break:break-word;">${content}</p>
    </div>
  </div>`;
}

function base(title: string, badge: string, badgeColor: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="${BASE}">
  <div style="${WRAPPER}">

    <!-- Header -->
    <div style="${HEADER_BG}">
      <div style="${LOGO_ROW}">All Star Party World × The 305 Club</div>
      <h1 style="${HEADING}">${title}</h1>
      <p style="${SUBHEADING}">${badge}</p>
    </div>

    <!-- Spacer -->
    <div style="height:20px;"></div>

    ${body}

    <!-- Footer -->
    <div style="${FOOTER}">
      <div style="width:36px;height:2px;background:${badgeColor};margin:0 auto 14px;border-radius:2px;"></div>
      All Star Party World &amp; The 305 Club<br />
      8770 SW 131st Street · Miami, Florida 33176<br />
      <a href="tel:+17864710100" style="color:#6b7a8d;text-decoration:none;">786-471-0100</a>
    </div>

  </div>
</body>
</html>`;
}

// ── Booking email ─────────────────────────────────────────────────────────────

export interface BookingData {
  venue?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cellPhone?: string;
  secondaryPhone?: string;
  okToText?: string;
  bestTimeToCall?: string;
  preferredDate?: string;
  alternateDate?: string;
  startTime?: string;
  partyLength?: string;
  numKids?: string;
  numAdults?: string;
  birthdayAge?: string;
  celebrating?: string;
  partyDescription?: string;
  hearAboutUs?: string;
}

const VENUE_LABELS: Record<string, string> = {
  'all-star-party-world': 'All Star Party World',
  '305-club': 'The 305 Club',
  'both': 'Both Venues',
};

export function bookingEmailHtml(d: BookingData): string {
  const venueName = VENUE_LABELS[d.venue ?? ''] ?? d.venue ?? '—';
  const venueColor = d.venue === 'all-star-party-world' ? '#d4a000' : '#3B7DEB';

  const body = `
    ${section('Venue', row('Selected Venue', `<span style="color:${venueColor};font-weight:700;">${venueName}</span>`))}

    ${section('Contact Info', [
      row('Name', `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim() || undefined),
      row('Email', d.email),
      row('Cell Phone', d.cellPhone),
      row('Secondary Phone', d.secondaryPhone),
      row('OK to Text', d.okToText === 'yes' ? '✓ Yes' : d.okToText ? 'No' : undefined),
      row('Best Time to Call', d.bestTimeToCall),
    ].join(''))}

    ${section('Event Details', [
      row('Preferred Date', fmtDate(d.preferredDate)),
      row('Alternate Date', fmtDate(d.alternateDate)),
      row('Start Time', d.startTime),
      row('Party Length', d.partyLength),
      row('Kids', d.numKids),
      row('Adults', d.numAdults),
      row('Birthday Age', d.birthdayAge),
      row('Celebrating', d.celebrating),
    ].join(''))}

    ${d.partyDescription ? textSection('Party Description', d.partyDescription) : ''}

    ${section('Source', row('How They Found Us', d.hearAboutUs))}

    <div style="text-align:center;padding:8px 24px 0;">
      <a href="tel:+17864710100" style="${CTA_BTN}">Call to Follow Up →</a>
    </div>
  `;

  return base('New Booking Request', `Submitted via allstarpartyworld.com`, venueColor, body);
}

// ── Catering order email ──────────────────────────────────────────────────────

export interface CateringItem {
  name: string;
  variation: string;
  price: number;
  qty?: number;
}

export interface CateringOrderData {
  items: CateringItem[];
  total: number;
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  notes?: string;
}

export function cateringEmailHtml(d: CateringOrderData): string {
  const itemRows = d.items.map(item => `<div>
    <div style="${LABEL_BAND}">${item.name}</div>
    <div style="${VALUE_BAND}">${item.variation} &nbsp;·&nbsp; <strong style="color:#1a1f2e;">$${item.price.toFixed(2)}</strong></div>
  </div>`).join('');

  const totalRow = `
    <div style="padding:12px 18px;background:#fffbee;border-top:2px solid #F5C518;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size:13px;color:#8892a0;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Estimated Total</td>
          <td style="font-size:20px;font-weight:700;color:#b8860b;text-align:right;">$${d.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  const body = `
    <div style="${SECTION}">
      <div style="${SECTION_LABEL}">Catering Selection (${d.items.length} item${d.items.length !== 1 ? 's' : ''})</div>
      ${itemRows}
      ${totalRow}
    </div>

    ${(d.name || d.email || d.phone || d.eventDate) ? section('Contact & Event', [
      row('Name', d.name),
      row('Email', d.email),
      row('Phone', d.phone),
      row('Event Date', fmtDate(d.eventDate)),
    ].join('')) : ''}

    ${d.notes ? textSection('Notes', d.notes) : ''}

    <p style="font-size:11px;color:#9aa3ad;text-align:center;padding:0 24px 8px;line-height:1.6;">
      *Estimated total excludes applicable taxes and service fees. Final pricing confirmed at booking.
    </p>

    <div style="text-align:center;padding:8px 24px 0;">
      <a href="tel:+17864710100" style="${CTA_BTN}">Call to Confirm Order →</a>
    </div>
  `;

  return base('Catering Inquiry', 'New catering selection from allstarpartyworld.com', '#F5C518', body);
}

export { bookingEmailHtml as buildBookingEmail, cateringEmailHtml as buildCateringEmail };
export type { BookingData, CateringOrderData, CateringItem };
