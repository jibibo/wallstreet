export default function calculateDebt(userTransactions) {
  let total = userTransactions.reduce((acc, transaction) => (acc + transaction.amount), 0);

  return total;
}
