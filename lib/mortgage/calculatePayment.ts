export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12

  const totalPayments = years * 12

  const payment =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  return payment
}