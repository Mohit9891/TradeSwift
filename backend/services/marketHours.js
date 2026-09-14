// NSE cash hours in IST: Mon–Fri 09:15–15:30. AMO orders placed outside
// these hours stay PENDING until the next open (checked each poll cycle).
function isMarketOpen(at = new Date()) {
  const ist = new Date(at.getTime() + (330 + at.getTimezoneOffset()) * 60000);
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
}

module.exports = { isMarketOpen };
