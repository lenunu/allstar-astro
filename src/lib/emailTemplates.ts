const BASE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  background: #0e0f14;
  margin: 0;
  padding: 0;
`;

const WRAPPER = `
  max-width: 600px;
  margin: 0 auto;
  background: #0e0f14;
`;

const HEADER_BG = `
  background: linear-gradient(135deg, #1c1f2b 0%, #14161e 100%);
  border-bottom: 3px solid #F5C518;
  padding: 36px 40px 28px;
  text-align: center;
`;

const LOGO_ROW = `
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const HEADING = `
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
  line-height: 1.2;
`;

const SUBHEADING = `
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  margin: 0;
`;

const SECTION = `
  background: #14161e;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  margin: 0 24px 16px;
  overflow: hidden;
`;

const SECTION_LABEL = `
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 10px 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
`;

const SECTION_BODY = `padding: 16px 20px;`;

const ROW = `
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 13.5px;
`;

const ROW_LAST = `
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 13.5px;
`;

const LABEL_STYLE = `color: rgba(255,255,255,0.45); flex-shrink: 0; padding-right: 16px;`;
const VALUE_STYLE = `color: #ffffff; font-weight: 500; text-align: right;`;

const FOOTER = `
  text-align: center;
  padding: 24px 40px 32px;
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  line-height: 1.7;
`;

const CTA_BTN = `
  display: inline-block;
  background: #3B7DEB;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 28px;
  border-radius: 8px;
  margin: 8px 0 24px;
`;

function row(label: string, value: string | undefined, last = false): string {
  if (!value) return '';
  return `<div style="${last ? ROW_LAST : ROW}">
    <span style="${LABEL_STYLE}">${label}</span>
    <span style="${VALUE_STYLE}">${value}</span>
  </div>`;
}

function section(title: string, rows: string): string {
  return `<div style="${SECTION}">
    <div style="${SECTION_LABEL}">${title}</div>
    <div style="${SECTION_BODY}">${rows}</div>
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
    <div style="height:24px;"></div>

    ${body}

    <!-- Footer -->
    <div style="${FOOTER}">
      <div style="width:40px;height:2px;background:${badgeColor};margin:0 auto 16px;border-radius:2px;"></div>
      All Star Party World &amp; The 305 Club<br />
      8770 SW 131st Street · Miami, Florida 33176<br />
      <a href="tel:+17864710100" style="color:rgba(255,255,255,0.4);text-decoration:none;">786-471-0100</a>
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
  const venueColor = d.venue === 'all-star-party-world' ? '#F5C518' : '#3B7DEB';

  const body = `
    ${section('Venue', [
      row('Selected Venue', `<span style="color:${venueColor};font-weight:700;">${venueName}</span>`, true),
    ].join(''))}

    ${section('Contact Info', [
      row('Name', `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim()),
      row('Email', d.email),
      row('Cell Phone', d.cellPhone),
      row('Secondary Phone', d.secondaryPhone),
      row('OK to Text', d.okToText === 'yes' ? '✓ Yes' : 'No'),
      row('Best Time to Call', d.bestTimeToCall, true),
    ].join(''))}

    ${section('Event Details', [
      row('Preferred Date', d.preferredDate),
      row('Alternate Date', d.alternateDate),
      row('Start Time', d.startTime),
      row('Party Length', d.partyLength),
      row('Kids', d.numKids),
      row('Adults', d.numAdults),
      row('Birthday Age', d.birthdayAge),
      row('Celebrating', d.celebrating, true),
    ].join(''))}

    ${d.partyDescription ? section('Party Description', `
      <p style="font-size:13.5px;color:rgba(255,255,255,0.8);line-height:1.7;margin:0;">${d.partyDescription}</p>
    `) : ''}

    ${section('Source', [
      row('How They Found Us', d.hearAboutUs, true),
    ].join(''))}

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
  const itemRows = d.items.map((item, i) => {
    const isLast = i === d.items.length - 1;
    return `<div style="${isLast ? ROW_LAST : ROW}">
      <span style="${LABEL_STYLE}">${item.name}<br /><span style="font-size:11px;color:rgba(255,255,255,0.3);">${item.variation}</span></span>
      <span style="${VALUE_STYLE}">$${item.price.toFixed(2)}</span>
    </div>`;
  }).join('');

  const totalRow = `
    <div style="display:flex;justify-content:space-between;padding:12px 20px;background:rgba(245,197,24,0.06);border-top:1px solid rgba(245,197,24,0.15);font-size:14px;font-weight:700;">
      <span style="color:rgba(255,255,255,0.6);">Estimated Total</span>
      <span style="color:#F5C518;">$${d.total.toFixed(2)}</span>
    </div>
  `;

  const body = `
    <div style="${SECTION}">
      <div style="${SECTION_LABEL}">Catering Selection (${d.items.length} item${d.items.length !== 1 ? 's' : ''})</div>
      <div style="${SECTION_BODY}">${itemRows}</div>
      ${totalRow}
    </div>

    ${(d.name || d.email || d.phone || d.eventDate) ? section('Contact & Event', [
      row('Name', d.name),
      row('Email', d.email),
      row('Phone', d.phone),
      row('Event Date', d.eventDate, true),
    ].join('')) : ''}

    ${d.notes ? section('Notes', `
      <p style="font-size:13.5px;color:rgba(255,255,255,0.8);line-height:1.7;margin:0;">${d.notes}</p>
    `) : ''}

    <p style="font-size:11px;color:rgba(255,255,255,0.3);text-align:center;padding:0 24px 8px;line-height:1.6;">
      *Estimated total excludes applicable taxes and service fees. Final pricing confirmed at booking.
    </p>

    <div style="text-align:center;padding:8px 24px 0;">
      <a href="tel:+17864710100" style="${CTA_BTN}">Call to Confirm Order →</a>
    </div>
  `;

  return base('Catering Inquiry', 'New catering selection from allstarpartyworld.com', '#F5C518', body);
}
