export default function calculateDebt(userTransactions) {
  let total = 0;
  
  userTransactions.forEach((transaction) => {
    const { type, amount } = transaction;
    if (type === "deposit") {
      total -= parseInt(amount);
    } else {
      total += parseInt(amount);
    }
  });
  
  return total;
}
