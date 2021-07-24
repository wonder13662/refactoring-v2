const plays = require('./plays.json');
const invoices = require('./invoices.json');
const {
  statement,
} = require('./statement');

test('연극의 장르와 관객 규모를 기초로 비용을 계산한다', () => {
  let result = '';
  for (let invoice of invoices) {
    result += statement(invoice, plays);
  }

  const expected = '청구내역 (고객명: BigCo)\n hamlet: $650.00 (55석)\n As You Like It: $580.00 (35석)\n othello: $500.00 (40석)\n총액: $1,730.00\n적립 포인트: 47점\n';
  expect(result).toBe(expected);
});