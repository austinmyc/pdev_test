"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculateFutureValue,
  calculatePresentValue,
  calculateFutureValueAnnuity,
  calculatePresentValueAnnuity,
  calculateLoanPayment,
  calculateNPV,
  calculateIRR,
  generateAmortizationSchedule,
} from "@/lib/tvmCalculations";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("fv");

  const tabs = [
    { id: "fv", label: "Future Value", icon: "📈" },
    { id: "pv", label: "Present Value", icon: "💰" },
    { id: "annuity", label: "Annuities", icon: "📅" },
    { id: "loan", label: "Loan Payment", icon: "🏠" },
    { id: "npv", label: "NPV & IRR", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              TVM Calculators
            </span>
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Interactive tools for time value of money calculations
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-gray-800 border border-gray-700">
          <div className="flex flex-wrap border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] px-4 py-4 text-center font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "fv" && <FutureValueCalculator />}
            {activeTab === "pv" && <PresentValueCalculator />}
            {activeTab === "annuity" && <AnnuityCalculator />}
            {activeTab === "loan" && <LoanCalculator />}
            {activeTab === "npv" && <NPVCalculator />}
          </div>
        </div>
      </main>
    </div>
  );
}

function FutureValueCalculator() {
  const [pv, setPv] = useState("1000");
  const [rate, setRate] = useState("5");
  const [periods, setPeriods] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const fv = calculateFutureValue(
      parseFloat(pv),
      parseFloat(rate) / 100,
      parseFloat(periods)
    );
    setResult(fv);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Future Value Calculator</h2>
        <p className="text-gray-600 text-gray-400">
          Calculate how much a present sum will grow to in the future
        </p>
        <p className="text-sm mt-2 bg-gray-900 p-3 font-mono border-l-2 border-blue-500">
          FV = PV × (1 + r)^n
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Present Value (PV)
          </label>
          <input
            type="number"
            value={pv}
            onChange={(e) => setPv(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Interest Rate (% per period)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="5"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">
            Number of Periods (n)
          </label>
          <input
            type="number"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="10"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
      >
        Calculate Future Value
      </button>

      {result !== null && (
        <div className="bg-green-900/20 border-2 border-green-500 p-6">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(result)}
          </p>
          <p className="text-sm mt-2 text-gray-400">
            Your investment of {formatCurrency(parseFloat(pv))} will grow to{" "}
            {formatCurrency(result)} in {periods} periods at {rate}% per period.
          </p>
          <p className="text-sm mt-1 text-gray-400">
            Total gain: {formatCurrency(result - parseFloat(pv))} (
            {formatPercentage((result - parseFloat(pv)) / parseFloat(pv))})
          </p>
        </div>
      )}
    </div>
  );
}

function PresentValueCalculator() {
  const [fv, setFv] = useState("1628.89");
  const [rate, setRate] = useState("5");
  const [periods, setPeriods] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const pv = calculatePresentValue(
      parseFloat(fv),
      parseFloat(rate) / 100,
      parseFloat(periods)
    );
    setResult(pv);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Present Value Calculator</h2>
        <p className="text-gray-600 text-gray-400">
          Calculate what a future sum is worth in today&apos;s dollars
        </p>
        <p className="text-sm mt-2 bg-blue-50 bg-gray-900 p-3 rounded font-mono">
          PV = FV / (1 + r)^n
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Future Value (FV)
          </label>
          <input
            type="number"
            value={fv}
            onChange={(e) => setFv(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="1628.89"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Discount Rate (% per period)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="5"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Number of Periods (n)
          </label>
          <input
            type="number"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="10"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6  transition-colors"
      >
        Calculate Present Value
      </button>

      {result !== null && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500  p-6">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(result)}
          </p>
          <p className="text-sm mt-2 text-gray-600 text-gray-400">
            To receive {formatCurrency(parseFloat(fv))} in {periods} periods, you need to
            invest {formatCurrency(result)} today at {rate}% per period.
          </p>
        </div>
      )}
    </div>
  );
}

function AnnuityCalculator() {
  const [type, setType] = useState<"fv" | "pv">("fv");
  const [payment, setPayment] = useState("100");
  const [rate, setRate] = useState("5");
  const [periods, setPeriods] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (type === "fv") {
      const fv = calculateFutureValueAnnuity(
        parseFloat(payment),
        parseFloat(rate) / 100,
        parseFloat(periods)
      );
      setResult(fv);
    } else {
      const pv = calculatePresentValueAnnuity(
        parseFloat(payment),
        parseFloat(rate) / 100,
        parseFloat(periods)
      );
      setResult(pv);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Annuity Calculator</h2>
        <p className="text-gray-600 text-gray-400">
          Calculate the value of a series of equal payments
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Calculation Type</label>
        <div className="flex gap-4">
          <button
            onClick={() => setType("fv")}
            className={`flex-1 px-4 py-2  font-semibold transition-colors ${
              type === "fv"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Future Value
          </button>
          <button
            onClick={() => setType("pv")}
            className={`flex-1 px-4 py-2  font-semibold transition-colors ${
              type === "pv"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Present Value
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Payment per Period (PMT)
          </label>
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Interest Rate (% per period)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="5"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Number of Periods (n)
          </label>
          <input
            type="number"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="10"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6  transition-colors"
      >
        Calculate {type === "fv" ? "Future" : "Present"} Value
      </button>

      {result !== null && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500  p-6">
          <h3 className="text-xl font-bold mb-2">Result:</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(result)}
          </p>
          <p className="text-sm mt-2 text-gray-600 text-gray-400">
            {type === "fv"
              ? `Making ${periods} payments of ${formatCurrency(parseFloat(payment))} at ${rate}% will grow to ${formatCurrency(result)}`
              : `${periods} payments of ${formatCurrency(parseFloat(payment))} at ${rate}% is worth ${formatCurrency(result)} today`}
          </p>
          <p className="text-sm mt-1 text-gray-600 text-gray-400">
            Total payments: {formatCurrency(parseFloat(payment) * parseFloat(periods))}
          </p>
        </div>
      )}
    </div>
  );
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("200000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("30");
  const [result, setResult] = useState<{
    payment: number;
    schedule: Array<{
      period: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const calculate = () => {
    const annualRate = parseFloat(rate) / 100;
    const monthlyRate = annualRate / 12;
    const months = parseFloat(years) * 12;

    const payment = calculateLoanPayment(parseFloat(principal), monthlyRate, months);
    const schedule = generateAmortizationSchedule(
      parseFloat(principal),
      monthlyRate,
      Math.min(months, 12) // Show first year only
    );

    setResult({ payment, schedule });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Loan Payment Calculator</h2>
        <p className="text-gray-600 text-gray-400">
          Calculate monthly payment and view amortization schedule
        </p>
        <p className="text-sm mt-2 bg-blue-50 bg-gray-900 p-3 rounded font-mono">
          PMT = PV × [r(1 + r)^n] / [(1 + r)^n - 1]
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Loan Amount (Principal)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="200000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="6"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Loan Term (Years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="30"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6  transition-colors"
      >
        Calculate Payment
      </button>

      {result && (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500  p-6">
            <h3 className="text-xl font-bold mb-2">Monthly Payment:</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(result.payment)}
            </p>
            <p className="text-sm mt-2 text-gray-600 text-gray-400">
              Total amount paid: {formatCurrency(result.payment * parseFloat(years) * 12)}
            </p>
            <p className="text-sm mt-1 text-gray-600 text-gray-400">
              Total interest: {formatCurrency(result.payment * parseFloat(years) * 12 - parseFloat(principal))}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700  p-6 border dark:border-gray-600">
            <h3 className="text-xl font-bold mb-4">Amortization Schedule (First Year)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left py-2">Month</th>
                    <th className="text-right py-2">Payment</th>
                    <th className="text-right py-2">Principal</th>
                    <th className="text-right py-2">Interest</th>
                    <th className="text-right py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.period} className="border-b dark:border-gray-600">
                      <td className="py-2">{row.period}</td>
                      <td className="text-right">{formatCurrency(row.payment)}</td>
                      <td className="text-right">{formatCurrency(row.principal)}</td>
                      <td className="text-right">{formatCurrency(row.interest)}</td>
                      <td className="text-right">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NPVCalculator() {
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [cashFlows, setCashFlows] = useState("3000,3500,4000,4500,5000");
  const [discountRate, setDiscountRate] = useState("10");
  const [result, setResult] = useState<{ npv: number; irr: number } | null>(null);

  const calculate = () => {
    const flows = [-parseFloat(initialInvestment)].concat(
      cashFlows.split(",").map((cf) => parseFloat(cf.trim()))
    );
    const rate = parseFloat(discountRate) / 100;

    const npv = calculateNPV(flows, rate);
    const irr = calculateIRR(flows);

    setResult({ npv, irr });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">NPV & IRR Calculator</h2>
        <p className="text-gray-600 text-gray-400">
          Evaluate investment projects using Net Present Value and Internal Rate of Return
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Initial Investment (negative cash flow)
          </label>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Future Cash Flows (comma-separated)
          </label>
          <input
            type="text"
            value={cashFlows}
            onChange={(e) => setCashFlows(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="3000,3500,4000,4500,5000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter each year&apos;s cash flow separated by commas
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Discount Rate (% per year)
          </label>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="10"
            step="0.1"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6  transition-colors"
      >
        Calculate NPV & IRR
      </button>

      {result && (
        <div className="space-y-4">
          <div className={`border-2  p-6 ${
            result.npv >= 0
              ? "bg-green-50 dark:bg-green-900/20 border-green-500"
              : "bg-red-50 dark:bg-red-900/20 border-red-500"
          }`}>
            <h3 className="text-xl font-bold mb-2">Net Present Value (NPV):</h3>
            <p className={`text-3xl font-bold ${
              result.npv >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {formatCurrency(result.npv)}
            </p>
            <p className="text-sm mt-2 text-gray-600 text-gray-400">
              {result.npv >= 0
                ? "✓ This project should be accepted (NPV > 0)"
                : "✗ This project should be rejected (NPV < 0)"}
            </p>
          </div>

          <div className="bg-blue-50 bg-gray-900 border-2 border-blue-500  p-6">
            <h3 className="text-xl font-bold mb-2">Internal Rate of Return (IRR):</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatPercentage(result.irr)}
            </p>
            <p className="text-sm mt-2 text-gray-600 text-gray-400">
              {result.irr > parseFloat(discountRate) / 100
                ? `✓ IRR (${formatPercentage(result.irr)}) exceeds the discount rate (${discountRate}%)`
                : `✗ IRR (${formatPercentage(result.irr)}) is below the discount rate (${discountRate}%)`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
