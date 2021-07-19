const plays = require('./plays.json');
const invoices = require('./invoices.json');
const statement = require('./statement')

// 결과 출력
for (let invoice of invoices) {
  console.log(statement(invoice, plays));
}
