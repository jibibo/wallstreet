export default function calculateDebt(userTransactions) {
  let total = userTransactions.reduce((acc, transaction) => (acc + transaction.amount), 0);

  total = Math.round((total + Number.EPSILON) * 100) / 100;
  return total;
}
