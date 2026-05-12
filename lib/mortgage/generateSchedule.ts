export function generateSchedule(
  balance: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12
  const totalPayments = years * 12

  const payment =
    (balance *
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  let remainingBalance = balance

  const schedule = []

  for (let month = 1; month <= totalPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate

    const principalPayment =
      payment - interestPayment

    remainingBalance -= principalPayment

    schedule.push({
      month,
      payment,
      principalPayment,
      interestPayment,
      remainingBalance:
        remainingBalance > 0
          ? remainingBalance
          : 0,
    })
  }

  return schedule
}