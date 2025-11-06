"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { calculateFutureValue, calculateFutureValueAnnuity } from "@/lib/tvmCalculations";
import { formatCurrency } from "@/lib/formatters";

export default function VisualizationsPage() {
  const [activeViz, setActiveViz] = useState("growth");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TVM Visualizations
          </h1>
          <p className="text-center text-gray-400 mt-2">
            See the power of compound interest in action
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 border border-gray-700 p-8 space-y-8">
          {/* Visualization Selector */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setActiveViz("growth")}
              className={`px-6 py-3  font-semibold transition-colors ${
                activeViz === "growth"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📈 Investment Growth
            </button>
            <button
              onClick={() => setActiveViz("comparison")}
              className={`px-6 py-3  font-semibold transition-colors ${
                activeViz === "comparison"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              🔄 Rate Comparison
            </button>
            <button
              onClick={() => setActiveViz("annuity")}
              className={`px-6 py-3  font-semibold transition-colors ${
                activeViz === "annuity"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              💰 Annuity Growth
            </button>
            <button
              onClick={() => setActiveViz("composition")}
              className={`px-6 py-3  font-semibold transition-colors ${
                activeViz === "composition"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📊 Principal vs Interest
            </button>
          </div>

          {/* Visualizations */}
          {activeViz === "growth" && <InvestmentGrowthVisualization />}
          {activeViz === "comparison" && <RateComparisonVisualization />}
          {activeViz === "annuity" && <AnnuityGrowthVisualization />}
          {activeViz === "composition" && <CompositionVisualization />}
        </div>
      </main>
    </div>
  );
}

function InvestmentGrowthVisualization() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("30");

  const generateData = () => {
    const data = [];
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseInt(years);

    for (let year = 0; year <= n; year++) {
      const fv = calculateFutureValue(p, r, year);
      data.push({
        year: year,
        value: Math.round(fv),
        principal: p,
        interest: Math.round(fv - p),
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Investment Growth Over Time</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Watch how your investment grows with compound interest
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Initial Investment</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Annual Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Area
              type="monotone"
              dataKey="principal"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              name="Principal"
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Interest Earned"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Initial Investment</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(parseFloat(principal))}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Final Value</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(data[data.length - 1].value)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(data[data.length - 1].interest)}
          </p>
        </div>
      </div>
    </div>
  );
}

function RateComparisonVisualization() {
  const [principal] = useState(10000);
  const [years] = useState(30);

  const rates = [3, 5, 7, 10, 12];

  const generateData = () => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const entry: Record<string, number> = { year };
      rates.forEach((rate) => {
        const fv = calculateFutureValue(principal, rate / 100, year);
        entry[`rate${rate}`] = Math.round(fv);
      });
      data.push(entry);
    }
    return data;
  };

  const data = generateData();
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Impact of Different Interest Rates</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare how different rates affect your investment over {years} years
        </p>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
          Initial Investment: {formatCurrency(principal)}
        </p>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            {rates.map((rate, index) => (
              <Line
                key={rate}
                type="monotone"
                dataKey={`rate${rate}`}
                stroke={colors[index]}
                strokeWidth={2}
                name={`${rate}% Annual`}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {rates.map((rate, index) => {
          const finalValue = data[data.length - 1][`rate${rate}`];
          return (
            <div
              key={rate}
              className="p-4 "
              style={{ backgroundColor: `${colors[index]}20` }}
            >
              <p className="text-sm font-semibold" style={{ color: colors[index] }}>
                {rate}% Annual
              </p>
              <p className="text-lg font-bold mt-1">{formatCurrency(finalValue)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {((finalValue / principal - 1) * 100).toFixed(0)}% growth
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
        <p className="font-semibold">Key Insight:</p>
        <p className="text-sm mt-1">
          Even a small difference in interest rate can have a massive impact over time. A 12% return
          versus 3% over 30 years means the difference between {formatCurrency(data[data.length - 1].rate12)}
          and {formatCurrency(data[data.length - 1].rate3)} - that&apos;s {formatCurrency(data[data.length - 1].rate12 - data[data.length - 1].rate3)} more!
        </p>
      </div>
    </div>
  );
}

function AnnuityGrowthVisualization() {
  const [payment, setPayment] = useState("500");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("30");

  const generateData = () => {
    const data = [];
    const pmt = parseFloat(payment);
    const r = parseFloat(rate) / 100;
    const n = parseInt(years);

    for (let year = 0; year <= n; year++) {
      const fv = year === 0 ? 0 : calculateFutureValueAnnuity(pmt, r, year);
      const totalContributions = pmt * year;
      const interest = fv - totalContributions;

      data.push({
        year: year,
        value: Math.round(fv),
        contributions: totalContributions,
        interest: Math.round(interest),
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Annuity Growth Visualization</h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how regular contributions grow with compound interest
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Annual Payment</label>
          <input
            type="number"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Annual Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            step="0.5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600  focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="contributions" stackId="a" fill="#3b82f6" name="Your Contributions" />
            <Bar dataKey="interest" stackId="a" fill="#10b981" name="Interest Earned" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Contributions</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(data[data.length - 1].contributions)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Interest Earned</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(data[data.length - 1].interest)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 ">
          <p className="text-sm text-gray-600 dark:text-gray-400">Final Value</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(data[data.length - 1].value)}
          </p>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
        <p className="font-semibold">The Power of Regular Investing:</p>
        <p className="text-sm mt-1">
          By investing {formatCurrency(parseFloat(payment))} annually for {years} years, you contributed{" "}
          {formatCurrency(data[data.length - 1].contributions)} but ended up with{" "}
          {formatCurrency(data[data.length - 1].value)}. That&apos;s {formatCurrency(data[data.length - 1].interest)} in
          free money from compound interest!
        </p>
      </div>
    </div>
  );
}

function CompositionVisualization() {
  const [principal] = useState(10000);
  const [annualPayment] = useState(1000);
  const [rate] = useState(7);
  const [years] = useState(30);

  const generateData = () => {
    const data = [];
    let totalPrincipal = principal;

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        totalPrincipal += annualPayment;
      }

      const fv = calculateFutureValue(principal, rate / 100, year) +
        (year > 0 ? calculateFutureValueAnnuity(annualPayment, rate / 100, year) : 0);

      const interest = fv - totalPrincipal;

      data.push({
        year: year,
        principal: Math.round(totalPrincipal),
        interest: Math.round(interest),
        total: Math.round(fv),
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Principal vs Interest Over Time</h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how compound interest eventually becomes the larger portion of your wealth
        </p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>Initial Investment: {formatCurrency(principal)}</p>
          <p>Annual Contribution: {formatCurrency(annualPayment)}</p>
          <p>Annual Return: {rate}%</p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Area
              type="monotone"
              dataKey="principal"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              name="Your Money"
            />
            <Area
              type="monotone"
              dataKey="interest"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              name="Interest Earned"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-700 p-6  border dark:border-gray-600">
          <h3 className="font-semibold mb-4">Year 10</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Your Money:</span>
              <span className="font-bold">{formatCurrency(data[10].principal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data[10].interest)}
              </span>
            </div>
            <div className="flex justify-between border-t dark:border-gray-600 pt-2">
              <span>Total:</span>
              <span className="font-bold">{formatCurrency(data[10].total)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Interest is {((data[10].interest / data[10].total) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-6  border dark:border-gray-600">
          <h3 className="font-semibold mb-4">Year {years}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Your Money:</span>
              <span className="font-bold">{formatCurrency(data[years].principal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data[years].interest)}
              </span>
            </div>
            <div className="flex justify-between border-t dark:border-gray-600 pt-2">
              <span>Total:</span>
              <span className="font-bold">{formatCurrency(data[years].total)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Interest is {((data[years].interest / data[years].total) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
        <p className="font-semibold">The Magic of Compound Interest:</p>
        <p className="text-sm mt-1">
          Notice how interest becomes an increasingly larger portion of your wealth over time. After {years}{" "}
          years, {((data[years].interest / data[years].total) * 100).toFixed(1)}% of your wealth came from
          compound interest, not your contributions!
        </p>
      </div>
    </div>
  );
}
