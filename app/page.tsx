"use client";

import Link from "next/link";
import { useState } from "react";
import { FormulaBox } from "@/components/Math";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>("intro");
  const [tutorialStep, setTutorialStep] = useState(0);

  const tutorials = [
    {
      id: "intro",
      title: "Introduction: Why TVM Matters",
      content: (
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            Imagine you have $10,000 today. Your friend offers you a choice: take the $10,000 now,
            or wait one year and receive $10,000 then. Which would you choose?
          </p>
          <div className="bg-gray-800 p-6 space-y-4">
            <p className="text-yellow-400 font-semibold">The smart choice: Take the money today!</p>
            <p>Why? Because money today has <strong>earning potential</strong>. If you take the $10,000 now and invest it at even 5% annual interest, you&apos;ll have $10,500 in one year—$500 more than your friend offers.</p>
          </div>
          <p>
            This fundamental principle—that money available today is worth more than the same amount in the future—is called the <strong>Time Value of Money (TVM)</strong>.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 p-4">
              <div className="text-3xl mb-2">💼</div>
              <h4 className="font-semibold mb-2">Investment Decisions</h4>
              <p className="text-sm text-gray-400">Evaluate which investments will grow your wealth the most</p>
            </div>
            <div className="bg-gray-800 p-4">
              <div className="text-3xl mb-2">🏠</div>
              <h4 className="font-semibold mb-2">Buying a Home</h4>
              <p className="text-sm text-gray-400">Understand mortgages and compare loan options</p>
            </div>
            <div className="bg-gray-800 p-4">
              <div className="text-3xl mb-2">🎓</div>
              <h4 className="font-semibold mb-2">Retirement Planning</h4>
              <p className="text-sm text-gray-400">Calculate how much to save for your future</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "concepts",
      title: "Core Concepts: The Building Blocks",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-800 p-5">
              <h4 className="text-xl font-semibold mb-3 text-blue-400">Present Value (PV)</h4>
              <p className="mb-3">The current value of money. What you have <strong>today</strong>.</p>
              <FormulaBox formula="PV = \frac{FV}{(1 + r)^n}" className="border-l-4 border-blue-500" />
              <p className="text-sm text-gray-400 mt-3">
                Think of it as: &quot;How much is that future payment worth to me right now?&quot;
              </p>
            </div>

            <div className="bg-gray-800 p-5">
              <h4 className="text-xl font-semibold mb-3 text-green-400">Future Value (FV)</h4>
              <p className="mb-3">What your money will grow to over time. The value <strong>in the future</strong>.</p>
              <FormulaBox formula="FV = PV \times (1 + r)^n" className="border-l-4 border-green-500" />
              <p className="text-sm text-gray-400 mt-3">
                Think of it as: &quot;If I invest this money today, how much will I have later?&quot;
              </p>
            </div>

            <div className="bg-gray-800 p-5">
              <h4 className="text-xl font-semibold mb-3 text-purple-400">Interest Rate (r)</h4>
              <p className="mb-3">The growth rate of your money, expressed as a percentage per period.</p>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>• Also called: discount rate, required return, cost of capital</li>
                <li>• Must match the time period (annual rate for years, monthly rate for months)</li>
                <li>• Higher rate = money grows faster</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-5">
              <h4 className="text-xl font-semibold mb-3 text-orange-400">Time Periods (n)</h4>
              <p className="mb-3">How long the money grows or is discounted.</p>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>• Can be years, months, quarters, days—any unit</li>
                <li>• More time = more growth (for FV) or more discounting (for PV)</li>
                <li>• Must match the interest rate period</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "examples",
      title: "Real-World Examples with Visuals",
      content: (
        <div className="space-y-8">
          {/* Car Purchase Example */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🚗</div>
              <h4 className="text-xl font-semibold">Example 1: Buying a Car</h4>
            </div>
            <div className="space-y-4">
              <p>You want to buy a car that costs <strong className="text-green-400">$25,000</strong> in 3 years. If you can invest at 6% annually, how much should you save today?</p>

              <div className="bg-gray-900 p-4">
                <div className="space-y-3">
                  <div className="text-sm">Given: FV = $25,000, r = 6% = 0.06, n = 3 years</div>
                  <FormulaBox formula="PV = \frac{FV}{(1 + r)^n} = \frac{\$25{,}000}{(1.06)^3} = \frac{\$25{,}000}{1.191016} = \$20{,}990.66" className="border-l-4 border-blue-500" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-900 p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">💵</div>
                  <div className="text-sm text-gray-400">Today</div>
                  <div className="text-lg font-bold text-green-400">$20,990.66</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="border-t-2 border-dashed border-gray-600 relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      3 years @ 6%
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="text-sm text-gray-400">Future</div>
                  <div className="text-lg font-bold text-blue-400">$25,000</div>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                <strong>Key Insight:</strong> You only need $20,990.66 today because your investment will grow to exactly $25,000 in 3 years!
              </p>
            </div>
          </div>

          {/* House Down Payment Example */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🏡</div>
              <h4 className="text-xl font-semibold">Example 2: Saving for a House</h4>
            </div>
            <div className="space-y-4">
              <p>You invest <strong className="text-blue-400">$50,000</strong> today at 7% annually for 5 years. How much will you have for a house down payment?</p>

              <div className="bg-gray-900 p-4">
                <div className="space-y-3">
                  <div className="text-sm">Given: PV = $50,000, r = 7% = 0.07, n = 5 years</div>
                  <FormulaBox formula="FV = PV \times (1 + r)^n = \$50{,}000 \times (1.07)^5 = \$50{,}000 \times 1.402552 = \$70{,}127.60" className="border-l-4 border-green-500" />
                </div>
              </div>

              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Initial Investment</span>
                  <span className="text-blue-400 font-semibold">$50,000.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Interest Earned</span>
                  <span className="text-green-400 font-semibold">+$20,127.60</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                  <span className="font-semibold">Total Future Value</span>
                  <span className="text-xl font-bold text-green-400">$70,127.60</span>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                <strong>Key Insight:</strong> Your money grew by 40%! That&apos;s the power of compound interest over time.
              </p>
            </div>
          </div>

          {/* Retirement Annuity Example */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">👴</div>
              <h4 className="text-xl font-semibold">Example 3: Monthly Retirement Savings</h4>
            </div>
            <div className="space-y-4">
              <p>You save <strong className="text-purple-400">$500/month</strong> for 30 years at 8% annual return. How much will you have?</p>

              <div className="bg-gray-900 p-4">
                <div className="space-y-3">
                  <div className="text-sm">Given: PMT = $500, r = 8%/12 = 0.00667, n = 30×12 = 360 months</div>
                  <FormulaBox formula="FV = PMT \times \frac{(1 + r)^n - 1}{r} = \$500 \times \frac{(1.00667)^{360} - 1}{0.00667} = \$745{,}179.85" className="border-l-4 border-purple-500" />
                </div>
              </div>

              <div className="bg-gray-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Contributions</span>
                  <span className="text-blue-400">$180,000</span>
                  <span className="text-xs text-gray-500">(500 × 360)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Interest Earned</span>
                  <span className="text-green-400 font-bold">$565,179.85</span>
                  <span className="text-xs text-gray-500">(314% gain!)</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
                  <span className="font-semibold">Final Balance</span>
                  <span className="text-2xl font-bold text-green-400">$745,179.85</span>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                <strong>Key Insight:</strong> Regular contributions + compound interest + time = Wealth! You contributed $180k but ended with $745k.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "relationship",
      title: "The Relationship Between Rate, Time, and Value",
      content: (
        <div className="space-y-6">
          <p className="text-lg">Understanding how interest rates and time affect money is crucial. Let&apos;s explore:</p>

          {/* Interest Rate Impact */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-blue-400">📊 Impact of Interest Rate</h4>
            <p className="mb-4">Starting with $10,000 invested for 10 years at different rates:</p>

            <div className="space-y-3">
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>3% annual rate:</span>
                  <span className="font-bold text-gray-400">$13,439</span>
                  <span className="text-sm text-gray-500">(+34%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>5% annual rate:</span>
                  <span className="font-bold text-yellow-400">$16,289</span>
                  <span className="text-sm text-gray-500">(+63%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>7% annual rate:</span>
                  <span className="font-bold text-orange-400">$19,672</span>
                  <span className="text-sm text-gray-500">(+97%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>10% annual rate:</span>
                  <span className="font-bold text-green-400">$25,937</span>
                  <span className="text-sm text-gray-500">(+159%)</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              <strong>Insight:</strong> A seemingly small difference in rate (like 5% vs 7%) can mean thousands of dollars over time!
            </p>
          </div>

          {/* Time Impact */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-green-400">⏰ Impact of Time</h4>
            <p className="mb-4">Investing $10,000 at 7% annual rate for different periods:</p>

            <div className="space-y-3">
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>After 5 years:</span>
                  <span className="font-bold text-gray-400">$14,026</span>
                  <span className="text-sm text-gray-500">(+40%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>After 10 years:</span>
                  <span className="font-bold text-yellow-400">$19,672</span>
                  <span className="text-sm text-gray-500">(+97%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>After 20 years:</span>
                  <span className="font-bold text-orange-400">$38,697</span>
                  <span className="text-sm text-gray-500">(+287%)</span>
                </div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="flex justify-between items-center">
                  <span>After 30 years:</span>
                  <span className="font-bold text-green-400">$76,123</span>
                  <span className="text-sm text-gray-500">(+661%)</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              <strong>Insight:</strong> Time is your friend! The longer you invest, the more powerful compound interest becomes.
            </p>
          </div>

          {/* The Rule of 72 */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-purple-400">🎯 The Rule of 72</h4>
            <p className="mb-4">Want a quick way to estimate how long it takes to double your money?</p>

            <FormulaBox formula="\text{Years to Double} = \frac{72}{\text{Interest Rate}}" className="text-center border-l-4 border-purple-500" />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900 p-4">
                <div className="text-sm text-gray-400 mb-2">At 6% annual rate:</div>
                <div className="font-bold">72 / 6 = 12 years to double</div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-sm text-gray-400 mb-2">At 9% annual rate:</div>
                <div className="font-bold">72 / 9 = 8 years to double</div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-sm text-gray-400 mb-2">At 3% annual rate:</div>
                <div className="font-bold">72 / 3 = 24 years to double</div>
              </div>
              <div className="bg-gray-900 p-4">
                <div className="text-sm text-gray-400 mb-2">At 12% annual rate:</div>
                <div className="font-bold">72 / 12 = 6 years to double</div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              <strong>Pro Tip:</strong> This rule works surprisingly well for rates between 6% and 10%!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "calculator-tutorial",
      title: "How to Use the Calculators",
      content: (
        <div className="space-y-6">
          <p className="text-lg">Our interactive calculators make TVM easy. Here&apos;s how to use them:</p>

          {/* Future Value Calculator */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-green-400">📈 Future Value Calculator</h4>
            <p className="mb-4"><strong>Use when:</strong> You want to know how much an investment will grow</p>

            <div className="bg-gray-900 p-4 space-y-3">
              <div>
                <div className="text-sm text-gray-400">Step 1: Enter Present Value (PV)</div>
                <div className="text-sm">How much money you&apos;re starting with today</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 2: Enter Interest Rate (r)</div>
                <div className="text-sm">The growth rate per period (as a percentage)</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 3: Enter Number of Periods (n)</div>
                <div className="text-sm">How long you&apos;ll let it grow</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Result:</div>
                <div className="text-sm">The calculator shows your future value!</div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 mt-4">
              <div className="text-sm font-semibold mb-2">Example Scenario:</div>
              <div className="text-sm">PV = $5,000 | Rate = 6% per year | Periods = 10 years</div>
              <div className="text-sm mt-2">Result: <span className="text-green-400 font-bold">FV = $8,954.24</span></div>
            </div>
          </div>

          {/* Present Value Calculator */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-blue-400">💰 Present Value Calculator</h4>
            <p className="mb-4"><strong>Use when:</strong> You know what you need in the future and want to know how much to invest now</p>

            <div className="bg-gray-900 p-4 space-y-3">
              <div>
                <div className="text-sm text-gray-400">Step 1: Enter Future Value (FV)</div>
                <div className="text-sm">How much money you need in the future</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 2: Enter Discount Rate (r)</div>
                <div className="text-sm">Your expected return rate per period</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 3: Enter Number of Periods (n)</div>
                <div className="text-sm">How long until you need the money</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Result:</div>
                <div className="text-sm">How much to invest today!</div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 mt-4">
              <div className="text-sm font-semibold mb-2">Example Scenario:</div>
              <div className="text-sm">FV = $20,000 | Rate = 5% per year | Periods = 8 years</div>
              <div className="text-sm mt-2">Result: <span className="text-green-400 font-bold">PV = $13,530.57</span></div>
            </div>
          </div>

          {/* Annuity Calculator */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-purple-400">📅 Annuity Calculator</h4>
            <p className="mb-4"><strong>Use when:</strong> You&apos;re making regular, equal payments (like monthly savings or loan payments)</p>

            <div className="bg-gray-900 p-4 space-y-3">
              <div>
                <div className="text-sm text-gray-400">Step 1: Choose FV or PV</div>
                <div className="text-sm">FV = How much your savings will grow | PV = What loan you can afford</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 2: Enter Payment (PMT)</div>
                <div className="text-sm">How much you pay/save each period</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 3: Enter Rate and Periods</div>
                <div className="text-sm">Interest rate and number of payments</div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 mt-4">
              <div className="text-sm font-semibold mb-2">Example Scenario (FV):</div>
              <div className="text-sm">PMT = $200/month | Rate = 6%/year | Periods = 60 months (5 years)</div>
              <div className="text-sm mt-2">Result: <span className="text-green-400 font-bold">FV = $13,954.41</span></div>
              <div className="text-sm text-gray-400 mt-1">You contributed $12,000 but have $13,954!</div>
            </div>
          </div>

          {/* Loan Calculator */}
          <div className="bg-gray-800 p-6">
            <h4 className="text-xl font-semibold mb-4 text-orange-400">🏠 Loan Payment Calculator</h4>
            <p className="mb-4"><strong>Use when:</strong> You want to calculate mortgage or loan payments</p>

            <div className="bg-gray-900 p-4 space-y-3">
              <div>
                <div className="text-sm text-gray-400">Step 1: Enter Loan Amount</div>
                <div className="text-sm">How much you&apos;re borrowing</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 2: Enter Annual Interest Rate</div>
                <div className="text-sm">The loan&apos;s APR (will be converted to monthly)</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Step 3: Enter Loan Term (years)</div>
                <div className="text-sm">How long to repay (will be converted to months)</div>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 mt-4">
              <div className="text-sm font-semibold mb-2">Example Scenario:</div>
              <div className="text-sm">Loan = $300,000 | Rate = 4.5% | Term = 30 years</div>
              <div className="text-sm mt-2">Result: <span className="text-green-400 font-bold">Payment = $1,520/month</span></div>
              <div className="text-sm text-gray-400 mt-1">Total paid over 30 years: $547,200 (includes $247,200 interest)</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-center mb-3">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Time Value of Money
            </span>
          </h1>
          <p className="text-center text-gray-400 text-lg">
            Master the most fundamental concept in finance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/calculators"
            className="group bg-gray-800 p-6 hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500"
          >
            <div className="text-4xl mb-3">🧮</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400">Interactive Calculators</h3>
            <p className="text-gray-400 text-sm">
              Calculate FV, PV, NPV, loan payments, and more
            </p>
          </Link>

          <Link
            href="/visualizations"
            className="group bg-gray-800 p-6 hover:bg-gray-750 transition-all border border-gray-700 hover:border-green-500"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-green-400">Visualizations</h3>
            <p className="text-gray-400 text-sm">
              See how money grows over time with interactive charts
            </p>
          </Link>

          <Link
            href="/practice"
            className="group bg-gray-800 p-6 hover:bg-gray-750 transition-all border border-gray-700 hover:border-purple-500"
          >
            <div className="text-4xl mb-3">✏️</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400">Practice Quiz</h3>
            <p className="text-gray-400 text-sm">
              Test your knowledge with interactive problems
            </p>
          </Link>
        </div>

        {/* Tutorial System */}
        <div className="bg-gray-800 border border-gray-700 mb-12">
          <div className="border-b border-gray-700 p-6">
            <h2 className="text-3xl font-bold text-center">Complete Tutorial</h2>
            <p className="text-center text-gray-400 mt-2">Work through these sections to master TVM</p>
          </div>

          {/* Tutorial Navigation */}
          <div className="border-b border-gray-700 p-4 bg-gray-850">
            <div className="flex flex-wrap gap-2">
              {tutorials.map((tutorial, index) => (
                <button
                  key={tutorial.id}
                  onClick={() => setActiveSection(tutorial.id)}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${
                    activeSection === tutorial.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {index + 1}. {tutorial.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="p-8">
            {tutorials.map((tutorial) => (
              activeSection === tutorial.id && (
                <div key={tutorial.id}>
                  <h3 className="text-2xl font-bold mb-6">{tutorial.title}</h3>
                  {tutorial.content}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                    <button
                      onClick={() => {
                        const currentIndex = tutorials.findIndex(t => t.id === activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(tutorials[currentIndex - 1].id);
                        }
                      }}
                      disabled={tutorials.findIndex(t => t.id === activeSection) === 0}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = tutorials.findIndex(t => t.id === activeSection);
                        if (currentIndex < tutorials.length - 1) {
                          setActiveSection(tutorials[currentIndex + 1].id);
                        }
                      }}
                      disabled={tutorials.findIndex(t => t.id === activeSection) === tutorials.length - 1}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Quick Reference Card */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 border border-blue-700">
          <h2 className="text-2xl font-bold mb-6">Quick Reference Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-300">Key Variables</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">PV</span>
                  <span>Present Value</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">FV</span>
                  <span>Future Value</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">r</span>
                  <span>Interest Rate (per period)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">n</span>
                  <span>Number of Periods</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">PMT</span>
                  <span>Payment (per period)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-purple-300">Key Formulas</h3>
              <div className="space-y-2 text-sm">
                <FormulaBox formula="FV = PV \times (1 + r)^n" className="p-2" />
                <FormulaBox formula="PV = \frac{FV}{(1 + r)^n}" className="p-2" />
                <FormulaBox formula="FV_{\text{annuity}} = PMT \times \frac{(1+r)^n-1}{r}" className="p-2" />
                <FormulaBox formula="PV_{\text{annuity}} = PMT \times \frac{1-(1+r)^{-n}}{r}" className="p-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-700">
            <h3 className="font-semibold text-lg mb-3 text-green-300">Pro Tips</h3>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <li>• Always match rate and period units</li>
              <li>• Convert percentages to decimals</li>
              <li>• Higher rate = faster growth</li>
              <li>• More time = more compound growth</li>
              <li>• NPV &gt; 0 = accept project</li>
              <li>• Use Rule of 72 for quick estimates</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 mt-12 py-6 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Time Value of Money Interactive Learning Platform</p>
          <p className="mt-1">Educational tool for finance students</p>
        </div>
      </footer>
    </div>
  );
}
