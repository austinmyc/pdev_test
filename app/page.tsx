"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: "intro",
      title: "What is Time Value of Money?",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            The <strong>Time Value of Money (TVM)</strong> is a fundamental concept in finance that recognizes
            that money available today is worth more than the same amount in the future due to its potential
            earning capacity.
          </p>
          <p>
            This core principle underlies most financial decisions, from personal investments to corporate
            finance strategies. Understanding TVM helps you make informed decisions about:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Investment opportunities</li>
            <li>Loan payments and mortgages</li>
            <li>Retirement planning</li>
            <li>Business valuation</li>
            <li>Capital budgeting decisions</li>
          </ul>
        </div>
      ),
    },
    {
      id: "concepts",
      title: "Key Concepts",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">1. Present Value (PV)</h4>
            <p>
              The current worth of a future sum of money, given a specified rate of return.
            </p>
            <p className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded font-mono text-sm">
              PV = FV / (1 + r)^n
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">2. Future Value (FV)</h4>
            <p>
              The value of a current asset at a future date based on an assumed rate of growth.
            </p>
            <p className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded font-mono text-sm">
              FV = PV × (1 + r)^n
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">3. Interest Rate (r)</h4>
            <p>
              The rate at which money grows over time. Also called discount rate or required rate of return.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">4. Number of Periods (n)</h4>
            <p>
              The time duration over which the investment or cash flow occurs, typically measured in years.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">5. Annuities</h4>
            <p>
              A series of equal payments or receipts that occur at evenly spaced intervals.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Ordinary Annuity:</strong> Payments occur at the end of each period</li>
              <li><strong>Annuity Due:</strong> Payments occur at the beginning of each period</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "formulas",
      title: "Essential Formulas",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Future Value (Single Sum)</h4>
            <p className="font-mono text-sm">FV = PV × (1 + r)^n</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Present Value (Single Sum)</h4>
            <p className="font-mono text-sm">PV = FV / (1 + r)^n</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Future Value of Ordinary Annuity</h4>
            <p className="font-mono text-sm">FV = PMT × [((1 + r)^n - 1) / r]</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Present Value of Ordinary Annuity</h4>
            <p className="font-mono text-sm">PV = PMT × [(1 - (1 + r)^-n) / r]</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Loan Payment (Amortization)</h4>
            <p className="font-mono text-sm">PMT = PV × [r(1 + r)^n] / [(1 + r)^n - 1]</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Net Present Value (NPV)</h4>
            <p className="font-mono text-sm">NPV = Σ [CF_t / (1 + r)^t]</p>
          </div>
        </div>
      ),
    },
    {
      id: "examples",
      title: "Real-World Examples",
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">Example 1: Investment Decision</h4>
            <p className="text-sm mb-2">
              You have $10,000 to invest. Bank A offers 5% annual interest, while Bank B offers 4.8%
              compounded monthly. Which is better?
            </p>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>Solution:</strong> Calculate the effective annual rate for Bank B:
              EAR = (1 + 0.048/12)^12 - 1 = 4.91%. Bank B is better!
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">Example 2: Retirement Planning</h4>
            <p className="text-sm mb-2">
              You want $1 million in 30 years. If you can earn 7% annually, how much should you save
              monthly?
            </p>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>Solution:</strong> Using the FV annuity formula: Monthly payment = $1,010.52
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-lg mb-2">Example 3: Loan Decision</h4>
            <p className="text-sm mb-2">
              You need a $200,000 mortgage. Option A: 30-year at 6%. Option B: 15-year at 5.5%.
              What are your monthly payments?
            </p>
            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <strong>Solution:</strong> Option A: $1,199/month. Option B: $1,634/month.
              But Option B saves $143,000 in interest!
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Time Value of Money
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
            Interactive Learning Platform for Undergraduate Finance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/calculators"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500"
          >
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-xl font-bold mb-2">Interactive Calculators</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Calculate FV, PV, NPV, IRR, and more with visual demonstrations
            </p>
          </Link>

          <Link
            href="/visualizations"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-500"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Visualizations</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              See how money grows over time with interactive charts and graphs
            </p>
          </Link>

          <Link
            href="/practice"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-500"
          >
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="text-xl font-bold mb-2">Practice Problems</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Test your understanding with interactive exercises and quizzes
            </p>
          </Link>
        </div>

        {/* Learning Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Learn the Fundamentals</h2>

          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border-b dark:border-gray-700 last:border-b-0">
                <button
                  onClick={() =>
                    setActiveSection(activeSection === section.id ? null : section.id)
                  }
                  className="w-full text-left py-4 flex justify-between items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="text-lg font-semibold">{section.title}</span>
                  <span className="text-2xl">
                    {activeSection === section.id ? "−" : "+"}
                  </span>
                </button>

                {activeSection === section.id && (
                  <div className="pb-6 text-gray-700 dark:text-gray-300">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Reference</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Variables:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>PV</strong> = Present Value</li>
                <li><strong>FV</strong> = Future Value</li>
                <li><strong>r</strong> = Interest Rate (per period)</li>
                <li><strong>n</strong> = Number of Periods</li>
                <li><strong>PMT</strong> = Payment (per period)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Important Tips:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Always use consistent time periods</li>
                <li>• Convert percentages to decimals</li>
                <li>• Match interest rate to payment frequency</li>
                <li>• Payments at end = Ordinary Annuity</li>
                <li>• Payments at start = Annuity Due</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-12 py-6 border-t dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Time Value of Money - Interactive Learning Platform</p>
          <p className="mt-1">Educational tool for undergraduate finance students</p>
        </div>
      </footer>
    </div>
  );
}
