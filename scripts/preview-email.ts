import { bookingEmailHtml, cateringEmailHtml } from '../functions/api/_templates';
import { writeFileSync } from 'fs';

const booking = bookingEmailHtml({
  venue: 'all-star-party-world',
  firstName: 'Maria',
  lastName: 'Rodriguez',
  email: 'maria.rodriguez@gmail.com',
  cellPhone: '(305) 555-1234',
  secondaryPhone: '(786) 555-5678',
  okToText: 'yes',
  bestTimeToCall: 'After 4pm weekdays',
  preferredDate: '2026-07-12',
  alternateDate: '2026-07-19',
  startTime: '2:00 PM',
  partyLength: '3hrs',
  numKids: '15',
  numAdults: '8',
  birthdayAge: '7',
  celebrating: "Sofia's 7th Birthday",
  partyDescription: 'Looking for a princess theme with catering. We need a DJ and face painting if possible. This is a surprise party!',
  hearAboutUs: 'instagram',
});

const catering = cateringEmailHtml({
  items: [
    { name: 'Caesar Salad', variation: 'Large (20–25 ppl)', price: 99.95 },
    { name: 'Chicken Fingers', variation: 'Small (10–15 ppl)', price: 59.95 },
    { name: 'Fruit Platter', variation: 'Large (20–25 ppl)', price: 79.95 },
    { name: 'Birthday Cake', variation: 'Half Sheet', price: 45.00 },
  ],
  total: 284.85,
  name: 'Maria Rodriguez',
  email: 'maria.rodriguez@gmail.com',
  phone: '(305) 555-1234',
  eventDate: '2026-07-12',
  notes: 'Please make sure the cake has "Happy Birthday Sofia" written on it. Nut-free for all items.',
});

writeFileSync('preview-booking.html', booking);
writeFileSync('preview-catering.html', catering);

console.log('✓ preview-booking.html');
console.log('✓ preview-catering.html');
console.log('\nOpen with:');
console.log('  open preview-booking.html');
console.log('  open preview-catering.html');
