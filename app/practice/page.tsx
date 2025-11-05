"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculateFutureValue,
  calculatePresentValue,
  calculateLoanPayment,
  calculateNPV,
} from "@/lib/tvmCalculations";
import { formatCurrency, formatPercentage } from "@/lib/formatters";

interface Problem {
  id: number;
  question: string;
  type: "multiple-choice" | "calculation";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  calculateAnswer?: () => number;
}

const problems: Problem[] = [
  {
    id: 1,
    question:
      "If you invest $5,000 today at an annual interest rate of 6%, what will it be worth in 5 years?",
    type: "calculation",
    correctAnswer: "6691.13",
    explanation:
      "Using FV = PV × (1 + r)^n: FV = $5,000 × (1.06)^5 = $6,691.13. The investment grows by the compound interest factor.",
    hint: "Use the Future Value formula: FV = PV × (1 + r)^n",
    calculateAnswer: () => calculateFutureValue(5000, 0.06, 5),
  },
  {
    id: 2,
    question:
      "You need $10,000 in 3 years. If you can earn 8% annually, how much should you invest today?",
    type: "calculation",
    correctAnswer: "7938.32",
    explanation:
      "Using PV = FV / (1 + r)^n: PV = $10,000 / (1.08)^3 = $7,938.32. This is the present value of the future $10,000.",
    hint: "Use the Present Value formula: PV = FV / (1 + r)^n",
    calculateAnswer: () => calculatePresentValue(10000, 0.08, 3),
  },
  {
    id: 3,
    question:
      "What is the fundamental principle behind the Time Value of Money?",
    type: "multiple-choice",
    options: [
      "Money loses value over time due to inflation",
      "A dollar today is worth more than a dollar in the future",
      "Interest rates always increase over time",
      "Investments always grow at the same rate",
    ],
    correctAnswer: "A dollar today is worth more than a dollar in the future",
    explanation:
      "The core principle of TVM is that money available now is worth more than the same amount in the future because it can be invested to earn returns. This is independent of inflation.",
  },
  {
    id: 4,
    question:
      "You take out a $250,000 mortgage at 5% annual interest for 30 years. What is your monthly payment?",
    type: "calculation",
    correctAnswer: "1342.05",
    explanation:
      "First convert to monthly: rate = 5%/12 = 0.4167% per month, periods = 30×12 = 360 months. Using the loan payment formula: PMT = $1,342.05",
    hint: "Convert annual rate to monthly (divide by 12) and years to months (multiply by 12)",
    calculateAnswer: () => calculateLoanPayment(250000, 0.05 / 12, 30 * 12),
  },
  {
    id: 5,
    question:
      "Which investment has the higher effective annual rate: 12% compounded monthly or 12.5% compounded annually?",
    type: "multiple-choice",
    options: [
      "12% compounded monthly",
      "12.5% compounded annually",
      "They are equal",
      "Cannot be determined",
    ],
    correctAnswer: "12.5% compounded annually",
    explanation:
      "12% monthly = (1 + 0.12/12)^12 - 1 = 12.68% EAR. 12.5% annually = 12.5% EAR. Despite more frequent compounding, 12.5% annually is higher.",
  },
  {
    id: 6,
    question:
      "A project costs $50,000 initially and generates cash flows of $15,000, $20,000, and $25,000 in years 1-3. At a 10% discount rate, what is the NPV?",
    type: "calculation",
    correctAnswer: "2367.42",
    explanation:
      "NPV = -50,000 + 15,000/1.1 + 20,000/1.1² + 25,000/1.1³ = -50,000 + 13,636.36 + 16,528.93 + 18,782.87 = $2,367.42. Positive NPV means accept the project!",
    hint: "Discount each future cash flow back to present value and subtract the initial investment",
    calculateAnswer: () => calculateNPV([-50000, 15000, 20000, 25000], 0.1),
  },
  {
    id: 7,
    question:
      "What happens to the present value of a future payment as the discount rate increases?",
    type: "multiple-choice",
    options: [
      "Present value increases",
      "Present value decreases",
      "Present value stays the same",
      "Present value becomes negative",
    ],
    correctAnswer: "Present value decreases",
    explanation:
      "As the discount rate increases, the denominator (1 + r)^n gets larger, making the present value smaller. Higher discount rates mean future money is worth less today.",
  },
  {
    id: 8,
    question:
      "You invest $1,000 at the end of each year for 10 years at 7%. What is the future value (ordinary annuity)?",
    type: "calculation",
    correctAnswer: "13816.45",
    explanation:
      "Using FV annuity formula: FV = 1,000 × [((1.07)^10 - 1) / 0.07] = $13,816.45. This is significantly more than the $10,000 you contributed!",
    hint: "Use the Future Value of Annuity formula: FV = PMT × [((1 + r)^n - 1) / r]",
  },
  {
    id: 9,
    question: "What is an annuity?",
    type: "multiple-choice",
    options: [
      "A single lump sum payment",
      "A series of equal payments at regular intervals",
      "An investment with no risk",
      "A type of stock option",
    ],
    correctAnswer: "A series of equal payments at regular intervals",
    explanation:
      "An annuity is a financial product that involves equal periodic payments. Examples include mortgage payments, retirement income, and regular investment contributions.",
  },
  {
    id: 10,
    question:
      "If an investment doubles in 10 years, what is the approximate annual compound growth rate?",
    type: "multiple-choice",
    options: ["5%", "7.2%", "10%", "20%"],
    correctAnswer: "7.2%",
    explanation:
      "Using the Rule of 72 or the formula: r = (FV/PV)^(1/n) - 1 = (2)^(1/10) - 1 = 7.18%. The Rule of 72 (72/10 = 7.2%) gives a quick approximation!",
  },
];

export default function PracticePage() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const problem = problems[currentProblem];

  const checkAnswer = () => {
    const answer =
      problem.type === "calculation"
        ? parseFloat(userAnswer).toFixed(2)
        : selectedOption;
    const correct = parseFloat(answer).toFixed(2) === parseFloat(problem.correctAnswer).toFixed(2) || answer === problem.correctAnswer;

    if (correct) {
      setScore(score + 1);
    }
    setAttempted(attempted + 1);
    setShowResult(true);
  };

  const nextProblem = () => {
    setCurrentProblem((currentProblem + 1) % problems.length);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setShowHint(false);
  };

  const resetQuiz = () => {
    setCurrentProblem(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setShowHint(false);
    setScore(0);
    setAttempted(0);
  };

  const isCorrect = () => {
    if (problem.type === "calculation") {
      return (
        Math.abs(parseFloat(userAnswer) - parseFloat(problem.correctAnswer)) < 1
      );
    }
    return selectedOption === problem.correctAnswer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-2 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Practice Problems
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
            Test your understanding of Time Value of Money
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Your Progress</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Problem {currentProblem + 1} of {problems.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {attempted > 0 ? ((score / attempted) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {score} correct out of {attempted}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentProblem + 1) / problems.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Problem Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                {problem.type === "calculation"
                  ? "Calculation Problem"
                  : "Multiple Choice"}
              </span>
              <h3 className="text-2xl font-bold mb-4">{problem.question}</h3>
            </div>

            {!showResult ? (
              <>
                {problem.type === "calculation" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Your Answer (round to 2 decimal places)
                      </label>
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-lg"
                        placeholder="Enter your answer"
                        step="0.01"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {problem.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedOption === option
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                      >
                        <span className="font-semibold mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={checkAnswer}
                    disabled={
                      (problem.type === "calculation" && !userAnswer) ||
                      (problem.type === "multiple-choice" && !selectedOption)
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Check Answer
                  </button>
                  {problem.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
                    >
                      💡 Hint
                    </button>
                  )}
                </div>

                {showHint && problem.hint && (
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-400">
                      Hint:
                    </p>
                    <p className="text-sm mt-1 text-yellow-700 dark:text-yellow-300">
                      {problem.hint}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Result */}
                <div
                  className={`p-6 rounded-lg border-2 ${
                    isCorrect()
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                      : "bg-red-50 dark:bg-red-900/20 border-red-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">
                      {isCorrect() ? "✓" : "✗"}
                    </span>
                    <h4 className="text-xl font-bold">
                      {isCorrect() ? "Correct!" : "Incorrect"}
                    </h4>
                  </div>
                  <p className="text-sm">
                    {problem.type === "calculation" && (
                      <>
                        <strong>Correct answer:</strong>{" "}
                        {problem.calculateAnswer
                          ? formatCurrency(problem.calculateAnswer())
                          : problem.correctAnswer}
                      </>
                    )}
                    {problem.type === "multiple-choice" && (
                      <>
                        <strong>Correct answer:</strong> {problem.correctAnswer}
                      </>
                    )}
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6">
                  <h4 className="font-semibold text-lg mb-2">Explanation:</h4>
                  <p className="text-sm leading-relaxed">{problem.explanation}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={nextProblem}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {currentProblem < problems.length - 1
                      ? "Next Problem →"
                      : "Back to Start"}
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Reset Quiz
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Study Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Always identify what you&apos;re solving for (PV, FV, PMT, r, or n)</li>
              <li>• Make sure your time periods match (monthly payments need monthly rates)</li>
              <li>• Draw a timeline to visualize cash flows</li>
              <li>• Remember: money today is worth more than money tomorrow</li>
              <li>• For NPV: if positive, accept the project; if negative, reject it</li>
              <li>• Use a financial calculator or spreadsheet for complex problems</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
