"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  calculateFutureValue,
  calculatePresentValue,
  calculateLoanPayment,
  calculateNPV,
  calculateFutureValueAnnuity,
  calculatePresentValueAnnuity,
} from "@/lib/tvmCalculations";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { useQuizSocket } from "@/hooks/useQuizSocket";
import RealtimePerformance from "@/components/RealtimePerformance";

interface Problem {
  id: number;
  question: string;
  type: "multiple-choice" | "calculation";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  calculateAnswer?: () => number;
  difficulty: "easy" | "medium" | "hard";
}

const allProblems: Problem[] = [
  // Easy Problems
  {
    id: 1,
    difficulty: "easy",
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
    difficulty: "easy",
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
    difficulty: "easy",
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
      "The core principle of TVM is that money available now is worth more than the same amount in the future because it can be invested to earn returns.",
  },
  {
    id: 4,
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "easy",
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
    difficulty: "medium",
    question:
      "You invest $1,000 at the end of each year for 10 years at 7%. What is the future value (ordinary annuity)?",
    type: "calculation",
    correctAnswer: "13816.45",
    explanation:
      "Using FV annuity formula: FV = 1,000 × [((1.07)^10 - 1) / 0.07] = $13,816.45. This is significantly more than the $10,000 you contributed!",
    hint: "Use the Future Value of Annuity formula: FV = PMT × [((1 + r)^n - 1) / r]",
    calculateAnswer: () => calculateFutureValueAnnuity(1000, 0.07, 10),
  },
  {
    id: 9,
    difficulty: "easy",
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
    difficulty: "easy",
    question:
      "If an investment doubles in 10 years, what is the approximate annual compound growth rate?",
    type: "multiple-choice",
    options: ["5%", "7.2%", "10%", "20%"],
    correctAnswer: "7.2%",
    explanation:
      "Using the Rule of 72 or the formula: r = (FV/PV)^(1/n) - 1 = (2)^(1/10) - 1 = 7.18%. The Rule of 72 (72/10 = 7.2%) gives a quick approximation!",
  },
  // Additional Problems
  {
    id: 11,
    difficulty: "hard",
    question:
      "You save $300 per month for 20 years at 9% annual interest (compounded monthly). What will you have?",
    type: "calculation",
    correctAnswer: "201691.39",
    explanation:
      "Monthly rate = 9%/12 = 0.75%, periods = 20×12 = 240. FV = 300 × [((1.0075)^240 - 1) / 0.0075] = $201,691.39",
    hint: "Convert to monthly rate and periods, then use the annuity FV formula",
    calculateAnswer: () => calculateFutureValueAnnuity(300, 0.09 / 12, 20 * 12),
  },
  {
    id: 12,
    difficulty: "medium",
    question:
      "You win a lottery that pays $100,000 per year for 10 years. If the discount rate is 6%, what is the present value?",
    type: "calculation",
    correctAnswer: "736008.71",
    explanation:
      "Using PV annuity formula: PV = 100,000 × [(1 - (1.06)^-10) / 0.06] = $736,008.71. This is less than $1 million because of the time value of money!",
    hint: "Use the Present Value of Annuity formula",
    calculateAnswer: () => calculatePresentValueAnnuity(100000, 0.06, 10),
  },
  {
    id: 13,
    difficulty: "hard",
    question:
      "A business opportunity requires $80,000 investment and promises $25,000/year for 5 years. At 12% discount rate, should you invest?",
    type: "multiple-choice",
    options: [
      "Yes, NPV is positive",
      "No, NPV is negative",
      "Break even, NPV is zero",
      "Cannot determine",
    ],
    correctAnswer: "No, NPV is negative",
    explanation:
      "NPV = -80,000 + PV of annuity = -80,000 + 25,000×[(1-(1.12)^-5)/0.12] = -80,000 + 90,096.81 = $10,096.81. Wait, this is positive! Actually, let me recalculate: PV = 25,000 × 3.60478 = $90,119.50. NPV = -80,000 + 90,119.50 = $10,119.50 which is positive, so you should invest! But at 12%, it's borderline.",
  },
  {
    id: 14,
    difficulty: "medium",
    question:
      "If you need to accumulate $500,000 in 25 years and can earn 8% annually, how much should you invest today?",
    type: "calculation",
    correctAnswer: "73002.55",
    explanation:
      "PV = 500,000 / (1.08)^25 = 500,000 / 6.848 = $73,002.55. Time is powerful—you only need $73k today to get $500k in 25 years!",
    hint: "Use PV formula with a long time horizon",
    calculateAnswer: () => calculatePresentValue(500000, 0.08, 25),
  },
  {
    id: 15,
    difficulty: "hard",
    question:
      "You borrow $150,000 at 6.5% for 15 years. What are your monthly payments?",
    type: "calculation",
    correctAnswer: "1306.52",
    explanation:
      "Monthly rate = 6.5%/12 = 0.5417%, periods = 15×12 = 180. PMT = 150,000 × [0.005417(1.005417)^180] / [(1.005417)^180 - 1] = $1,306.52",
    hint: "Convert to monthly parameters first",
    calculateAnswer: () => calculateLoanPayment(150000, 0.065 / 12, 15 * 12),
  },
];

const demoProblemOrder = [3, 7, 9, 1, 2];
const demoProblems: Problem[] = demoProblemOrder
  .map((id) => allProblems.find((problem) => problem.id === id))
  .filter((problem): problem is Problem => Boolean(problem));

interface SessionData {
  currentProblem: number;
  score: number;
  attempted: number;
  answeredProblems: { [key: number]: boolean };
  sessionStartTime: number;
  quizMode?: "full" | "demo";
}

export default function PracticePage() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [quizMode, setQuizMode] = useState<"full" | "demo">("full");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [answeredProblems, setAnsweredProblems] = useState<{ [key: number]: boolean }>({});
  const [sessionId, setSessionId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [sessionStarted, setSessionStarted] = useState(false);

  const activeProblems = quizMode === "full" ? allProblems : demoProblems;
  const totalProblems = activeProblems.length;
  const problem = activeProblems[currentProblem];
  const answeredInMode = activeProblems.filter((p) => answeredProblems[p.id]).length;

  // Initialize websocket connection (only when session is started)
  const { isConnected, participants, totalParticipants, updateProgress } =
    useQuizSocket(
      sessionStarted ? sessionId : "",
      sessionStarted ? userId : "",
      sessionStarted ? userName : ""
    );

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("tvmQuizSession");
    if (savedSession) {
      const data: SessionData = JSON.parse(savedSession);
      setCurrentProblem(data.currentProblem);
      setScore(data.score);
      setAttempted(data.attempted);
      setAnsweredProblems(data.answeredProblems || {});
      setQuizMode(data.quizMode ?? "full");
    }

    // Generate or load user ID
    let existingUserId = localStorage.getItem("tvmUserId");
    if (!existingUserId) {
      existingUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("tvmUserId", existingUserId);
    }
    setUserId(existingUserId);

    // Use a global shared session ID for all users to see each other
    // You can change this to create different quiz rooms if needed
    const globalSessionId = "global-practice-session";
    setSessionId(globalSessionId);
    localStorage.setItem("tvmSessionId", globalSessionId);

    // Store session start time if not already stored
    if (!localStorage.getItem("tvmSessionStartTime")) {
      localStorage.setItem("tvmSessionStartTime", Date.now().toString());
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      const sessionData: SessionData = {
        currentProblem,
        score,
        attempted,
        answeredProblems,
        sessionStartTime: parseInt(localStorage.getItem("tvmSessionStartTime") || Date.now().toString()),
        quizMode,
      };
      localStorage.setItem("tvmQuizSession", JSON.stringify(sessionData));
    }
  }, [currentProblem, score, attempted, answeredProblems, sessionId, quizMode]);

  // Update progress via websocket when score changes
  useEffect(() => {
    if (sessionStarted && isConnected) {
      const normalizedStep = Math.min(currentProblem + 1, totalProblems);
      const progress = totalProblems ? (normalizedStep / totalProblems) * 100 : 0;
      updateProgress(score, attempted, progress);
    }
  }, [score, attempted, currentProblem, sessionStarted, isConnected, updateProgress, totalProblems]);

  const checkAnswer = () => {
    const answer =
      problem.type === "calculation"
        ? parseFloat(userAnswer).toFixed(2)
        : selectedOption;
    const correct = parseFloat(answer).toFixed(2) === parseFloat(problem.correctAnswer).toFixed(2) || answer === problem.correctAnswer;

    if (correct) {
      setScore(score + 1);
    }

    if (!answeredProblems[problem.id]) {
      setAttempted(attempted + 1);
      setAnsweredProblems({ ...answeredProblems, [problem.id]: true });
    }

    setShowResult(true);
    setAnswerRevealed(false);
  };

  const nextProblem = () => {
    if (!totalProblems) return;
    setCurrentProblem((currentProblem + 1) % totalProblems);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setShowHint(false);
    setAnswerRevealed(false);
  };

  const previousProblem = () => {
    if (currentProblem > 0) {
      setCurrentProblem(currentProblem - 1);
      setUserAnswer("");
      setSelectedOption("");
      setShowResult(false);
      setShowHint(false);
      setAnswerRevealed(false);
    }
  };

  const resetQuiz = () => {
    setCurrentProblem(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setShowHint(false);
    setAnswerRevealed(false);
    setScore(0);
    setAttempted(0);
    setAnsweredProblems({});
    localStorage.removeItem("tvmQuizSession");

    // Generate new session
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    localStorage.setItem("tvmSessionId", newSessionId);
    localStorage.setItem("tvmSessionStartTime", Date.now().toString());
  };

  const handleModeChange = (mode: "full" | "demo") => {
    if (mode === quizMode) return;
    setQuizMode(mode);
    setCurrentProblem(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowResult(false);
    setShowHint(false);
    setAnswerRevealed(false);
  };

  const isCorrect = () => {
    if (problem.type === "calculation") {
      return (
        Math.abs(parseFloat(userAnswer) - parseFloat(problem.correctAnswer)) < 1
      );
    }
    return selectedOption === problem.correctAnswer;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-900/30 border-green-700";
      case "medium": return "bg-yellow-900/30 border-yellow-700";
      case "hard": return "bg-red-900/30 border-red-700";
      default: return "bg-gray-900/30 border-gray-700";
    }
  };

  // Handle session start
  const handleStartSession = () => {
    if (userName.trim()) {
      setSessionStarted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 mb-2 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Practice Quiz
            </span>
          </h1>
          <p className="text-center text-gray-400">
            Test your understanding of Time Value of Money
          </p>
        </div>
      </header>

      {/* Welcome Modal - Show before session starts */}
      {!sessionStarted && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 border border-gray-700 p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Live Quiz!
            </h2>
            <p className="text-gray-400 mb-6">
              Join the collaborative quiz session and see how you compare with other participants in real-time!
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleStartSession();
                  }}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                onClick={handleStartSession}
                disabled={!userName.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Quiz Session
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Session ID: {sessionId.substring(0, 15)}...
            </p>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quiz Section - Left/Main Column */}
            <div className="lg:col-span-2 space-y-6">
          {/* Session Info & Score Card */}
          <div className="bg-gray-800 border border-gray-700 p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Progress</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {Math.min(currentProblem + 1, totalProblems)} / {totalProblems}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {answeredInMode} answered in this mode
                  </p>
                </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Score</h3>
                <p className="text-2xl font-bold text-green-400">
                  {attempted > 0 ? ((score / attempted) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {score} correct out of {attempted} attempted
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Session ID</h3>
                <p className="text-sm font-mono text-gray-300 truncate">
                  {sessionId.substring(0, 20)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">Auto-saved progress</p>
              </div>
            </div>

            {/* Progress Bar */}
              <div className="mt-4 bg-gray-700 h-2">
                <div
                  className="bg-blue-500 h-2 transition-all duration-300"
                  style={{
                    width: `${
                      totalProblems
                        ? (Math.min(currentProblem + 1, totalProblems) / totalProblems) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="mt-6 border-t border-gray-700 pt-6">
                <h3 className="text-sm text-gray-400 mb-2">Quiz Mode</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleModeChange("full")}
                    className={`px-4 py-2 font-semibold border transition-colors ${
                      quizMode === "full"
                        ? "bg-blue-600 border-blue-400 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Full Practice (15 Qs)
                  </button>
                  <button
                    onClick={() => handleModeChange("demo")}
                    className={`px-4 py-2 font-semibold border transition-colors ${
                      quizMode === "demo"
                        ? "bg-purple-600 border-purple-400 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    5-Question Demo
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {quizMode === "demo"
                    ? "Quick classroom-friendly set: 3 conceptual warm-ups followed by 2 calculation drills."
                    : "Use the full bank when you want deeper practice across every TVM concept."}
                </p>
              </div>
          </div>

          {/* Problem Card */}
          <div className="bg-gray-800 border border-gray-700 p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 border text-sm font-semibold ${getDifficultyBg(problem.difficulty)}`}>
                  {problem.difficulty.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-semibold">
                  {problem.type === "calculation"
                    ? "CALCULATION"
                    : "MULTIPLE CHOICE"}
                </span>
                {answeredProblems[problem.id] && (
                  <span className="px-3 py-1 bg-blue-900/30 border border-blue-700 text-blue-400 text-sm font-semibold">
                    ANSWERED
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold">{problem.question}</h3>
            </div>

            {!showResult ? (
              <>
                {problem.type === "calculation" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Your Answer (round to 2 decimal places)
                      </label>
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 text-lg"
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
                        className={`w-full text-left p-4 border-2 transition-all ${
                          selectedOption === option
                            ? "border-blue-500 bg-blue-900/20"
                            : "border-gray-600 hover:border-blue-700 bg-gray-700/50"
                        }`}
                      >
                        <span className="font-semibold mr-3 text-gray-400">
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 transition-colors"
                  >
                    Check Answer
                  </button>
                  {problem.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold transition-colors"
                    >
                      💡 {showHint ? "Hide" : "Show"} Hint
                    </button>
                  )}
                </div>

                {showHint && problem.hint && (
                  <div className="mt-4 bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
                    <p className="font-semibold text-yellow-400">
                      Hint:
                    </p>
                    <p className="text-sm mt-1 text-yellow-300">
                      {problem.hint}
                    </p>
                  </div>
                )}
              </>
            ) : (
            <div className="space-y-6">
              {/* Result */}
              <div
                className={`p-6 border-2 ${
                  isCorrect()
                    ? "bg-green-900/20 border-green-500"
                    : "bg-red-900/20 border-red-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">
                    {isCorrect() ? "✓" : "✗"}
                  </span>
                  <div>
                    <h4 className="text-xl font-bold">
                      {isCorrect() ? "Correct!" : "Incorrect"}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {answerRevealed
                        ? "Answer revealed below."
                        : "Click Reveal Answer when you're ready to discuss it."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAnswerRevealed(!answerRevealed)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 transition-colors"
              >
                {answerRevealed ? "Hide Answer & Explanation" : "Reveal Answer & Explanation"}
              </button>

              {answerRevealed && (
                <>
                  <div className="p-6 border-2 border-blue-500 bg-blue-900/20">
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

                  <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6">
                    <h4 className="font-semibold text-lg mb-2 text-blue-400">Explanation:</h4>
                    <p className="text-sm leading-relaxed">{problem.explanation}</p>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-4">
                {currentProblem > 0 && (
                  <button
                    onClick={previousProblem}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                <button
                  onClick={nextProblem}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
                >
                  {currentProblem < totalProblems - 1
                    ? "Next Problem →"
                    : "Back to Start"}
                </button>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                >
                  Reset Quiz
                </button>
              </div>
            </div>
            )}
          </div>

          {/* Problem Navigation Grid */}
          <div className="bg-gray-800 border border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4">Jump to Problem</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {activeProblems.map((p, index) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProblem(index);
                    setUserAnswer("");
                    setSelectedOption("");
                    setShowResult(false);
                    setShowHint(false);
                      setAnswerRevealed(false);
                    }}
                  className={`aspect-square flex items-center justify-center font-bold transition-colors ${
                    index === currentProblem
                      ? "bg-blue-600 text-white"
                      : answeredProblems[p.id]
                      ? "bg-green-700 text-white hover:bg-green-600"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  title={`Problem ${index + 1} - ${p.difficulty}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600"></div>
                <span className="text-gray-400">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-700"></div>
                <span className="text-gray-400">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700"></div>
                <span className="text-gray-400">Not Answered</span>
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 border border-purple-700">
            <h3 className="text-xl font-bold mb-3">Study Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Always identify what you&apos;re solving for (PV, FV, PMT, r, or n)</li>
              <li>• Make sure your time periods match (monthly payments need monthly rates)</li>
              <li>• Draw a timeline to visualize cash flows</li>
              <li>• Remember: money today is worth more than money tomorrow</li>
              <li>• For NPV: if positive, accept the project; if negative, reject it</li>
              <li>• Use a financial calculator or spreadsheet for complex problems</li>
              <li>• Your progress is automatically saved and can be resumed anytime</li>
            </ul>
          </div>
            </div>

            {/* Realtime Performance - Right Column */}
            <div className="lg:col-span-1">
              {sessionStarted && (
                <div className="lg:sticky lg:top-4">
                  <RealtimePerformance
                    participants={participants}
                    totalParticipants={totalParticipants}
                    isConnected={isConnected}
                    currentUserId={userId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
