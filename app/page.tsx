'use client'

import { useState } from 'react'
import { calculateMonthlyPayment } from '../lib/mortgage/calculatePayment'
import { formatCurrency } from '../lib/formatCurrency'
import { generateSchedule } from '../lib/mortgage/generateSchedule'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
export default function HomePage() {

  const [balance, setBalance] = useState(300000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [years, setYears] = useState(25)
  const [lumpSum, setLumpSum] = useState(50000)

  const currentPayment = calculateMonthlyPayment(
    balance,
    interestRate,
    years
  )

  const newBalance = balance - lumpSum

  const newPayment = calculateMonthlyPayment(
    newBalance,
    interestRate,
    years
  )

const monthlySavings = currentPayment - newPayment

const totalInterestSavings = monthlySavings * years * 12
const schedule = generateSchedule(
  balance - lumpSum,
  interestRate,
  years
)

const downloadPDF = async () => {
  const input = document.getElementById('report')

  if (!input) return

  const canvas = await html2canvas(input)

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF()

  const imgWidth = 210

  const pageHeight = 295

  const imgHeight =
    (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight

  let position = 0

  pdf.addImage(
    imgData,
    'PNG',
    0,
    position,
    imgWidth,
    imgHeight
  )

  heightLeft -= pageHeight

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight

    pdf.addPage()

    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    )

    heightLeft -= pageHeight
  }

  pdf.save('mortgage-report.pdf')
}

return (
    <main
  id="report"
  className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mortgage Recast Calculator
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your new mortgage payment after making
            a lump-sum payment toward your loan balance.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Loan Information
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block mb-2 font-medium">
                  Current Loan Balance
                </label>

                <input
  type="number"
  value={balance}
  onChange={(e) =>
    setBalance(Number(e.target.value))
  }
  className="w-full border border-gray-300 rounded-xl p-4"
/>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Interest Rate (%)
                </label>

                <input
  type="number"
  value={interestRate}
  onChange={(e) =>
    setInterestRate(Number(e.target.value))
  }
  className="w-full border border-gray-300 rounded-xl p-4"
/>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Remaining Loan Term (Years)
                </label>

                <input
  type="number"
  value={years}
  onChange={(e) =>
    setYears(Number(e.target.value))
  }
  className="w-full border border-gray-300 rounded-xl p-4"
/>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Lump Sum Payment
                </label>
                <button
  className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
>
  Calculate Savings
</button>

                <input
  type="number"
  value={lumpSum}
  onChange={(e) =>
    setLumpSum(Number(e.target.value))
  }
  className="w-full border border-gray-300 rounded-xl p-4"
/>
              </div>

            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Estimated Results
            </h2>

            <div className="space-y-6">

              <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-gray-500 mb-1">
                  Current Monthly Payment
                </p>

                <h3 className="text-3xl font-bold">
                  {formatCurrency(currentPayment)}
                </h3>
              </div>

              <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-gray-500 mb-1">
                  New Monthly Payment
                </p>

                <h3 className="text-3xl font-bold text-green-600">
                  ${newPayment.toFixed(0)}
                </h3>
              </div>

              <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-gray-500 mb-1">
                  Monthly Savings
                </p>

                <h3 className="text-3xl font-bold text-blue-600">
                  ${monthlySavings.toFixed(0)}
                  <div className="bg-gray-100 rounded-xl p-5">
  <p className="text-gray-500 mb-1">
    Estimated Interest Savings
  </p>

  <h3 className="text-3xl font-bold text-purple-600">
    {formatCurrency(totalInterestSavings)}
  </h3>
</div>
                </h3>
              </div>

            </div>
          </div>

        </div>

      </div>
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 overflow-auto">
  <h2 className="text-2xl font-semibold mb-6">
    Amortization Schedule
  </h2>

  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100">
        <th className="p-3 text-left">Month</th>
        <th className="p-3 text-left">Payment</th>
        <th className="p-3 text-left">Principal</th>
        <th className="p-3 text-left">Interest</th>
        <th className="p-3 text-left">Balance</th>
      </tr>
    </thead>

    <tbody>
      {schedule.slice(0, 12).map((item) => (
        <tr
          key={item.month}
          className="border-b"
        >
          <td className="p-3">
            {item.month}
          </td>

          <td className="p-3">
            {formatCurrency(item.payment)}
          </td>

          <td className="p-3">
            {formatCurrency(item.principalPayment)}
          </td>

          <td className="p-3">
            {formatCurrency(item.interestPayment)}
          </td>

          <td className="p-3">
            {formatCurrency(item.remainingBalance)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
  <h2 className="text-2xl font-semibold mb-6">
    Payment Breakdown Chart
  </h2>

  <div className="w-full h-[400px]">
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={schedule.slice(0, 24)}>

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="principalPayment"
          stroke="#2563eb"
        />

        <Line
          type="monotone"
          dataKey="interestPayment"
          stroke="#dc2626"
        />

      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
<button
  onClick={downloadPDF}
  className="mt-8 bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 transition"
>
  Download PDF Report
</button>
    </main>
  )
}