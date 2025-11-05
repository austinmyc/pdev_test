/**
 * Time Value of Money Calculation Utilities
 * All formulas based on standard financial mathematics
 */

/**
 * Calculate Future Value (FV)
 * FV = PV * (1 + r)^n
 * @param pv - Present Value
 * @param rate - Interest rate per period (as decimal, e.g., 0.05 for 5%)
 * @param periods - Number of periods
 * @returns Future Value
 */
export function calculateFutureValue(
  pv: number,
  rate: number,
  periods: number
): number {
  return pv * Math.pow(1 + rate, periods);
}

/**
 * Calculate Present Value (PV)
 * PV = FV / (1 + r)^n
 * @param fv - Future Value
 * @param rate - Interest rate per period (as decimal)
 * @param periods - Number of periods
 * @returns Present Value
 */
export function calculatePresentValue(
  fv: number,
  rate: number,
  periods: number
): number {
  return fv / Math.pow(1 + rate, periods);
}

/**
 * Calculate Future Value of an Ordinary Annuity
 * FV = PMT * [((1 + r)^n - 1) / r]
 * @param payment - Payment per period
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Future Value of Annuity
 */
export function calculateFutureValueAnnuity(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return payment * periods;
  return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/**
 * Calculate Present Value of an Ordinary Annuity
 * PV = PMT * [(1 - (1 + r)^-n) / r]
 * @param payment - Payment per period
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Present Value of Annuity
 */
export function calculatePresentValueAnnuity(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return payment * periods;
  return payment * ((1 - Math.pow(1 + rate, -periods)) / rate);
}

/**
 * Calculate Future Value of Annuity Due
 * FV = PMT * [((1 + r)^n - 1) / r] * (1 + r)
 * @param payment - Payment per period
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Future Value of Annuity Due
 */
export function calculateFutureValueAnnuityDue(
  payment: number,
  rate: number,
  periods: number
): number {
  return calculateFutureValueAnnuity(payment, rate, periods) * (1 + rate);
}

/**
 * Calculate Present Value of Annuity Due
 * PV = PMT * [(1 - (1 + r)^-n) / r] * (1 + r)
 * @param payment - Payment per period
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Present Value of Annuity Due
 */
export function calculatePresentValueAnnuityDue(
  payment: number,
  rate: number,
  periods: number
): number {
  return calculatePresentValueAnnuity(payment, rate, periods) * (1 + rate);
}

/**
 * Calculate Payment for a Loan (Amortization)
 * PMT = PV * [r * (1 + r)^n] / [(1 + r)^n - 1]
 * @param principal - Loan amount (present value)
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Payment per period
 */
export function calculateLoanPayment(
  principal: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return principal / periods;
  return (
    (principal * (rate * Math.pow(1 + rate, periods))) /
    (Math.pow(1 + rate, periods) - 1)
  );
}

/**
 * Calculate Net Present Value (NPV)
 * NPV = Σ [CF_t / (1 + r)^t] - Initial Investment
 * @param cashFlows - Array of cash flows (including initial investment as negative)
 * @param rate - Discount rate
 * @returns Net Present Value
 */
export function calculateNPV(cashFlows: number[], rate: number): number {
  return cashFlows.reduce((npv, cashFlow, period) => {
    return npv + cashFlow / Math.pow(1 + rate, period);
  }, 0);
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 * @param cashFlows - Array of cash flows
 * @param guess - Initial guess for IRR (default 0.1)
 * @returns Internal Rate of Return
 */
export function calculateIRR(
  cashFlows: number[],
  guess: number = 0.1
): number {
  const maxIterations = 100;
  const tolerance = 0.00001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + rate, j);
      dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  return rate;
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 * CAGR = (FV / PV)^(1/n) - 1
 * @param beginningValue - Starting value
 * @param endingValue - Ending value
 * @param periods - Number of periods
 * @returns Compound Annual Growth Rate
 */
export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  periods: number
): number {
  return Math.pow(endingValue / beginningValue, 1 / periods) - 1;
}

/**
 * Convert annual rate to period rate
 * @param annualRate - Annual interest rate
 * @param periodsPerYear - Number of periods per year (e.g., 12 for monthly)
 * @returns Period rate
 */
export function convertToPeriodRate(
  annualRate: number,
  periodsPerYear: number
): number {
  return annualRate / periodsPerYear;
}

/**
 * Calculate effective annual rate (EAR) from nominal rate
 * EAR = (1 + r/m)^m - 1
 * @param nominalRate - Nominal annual rate
 * @param compoundingPeriods - Number of compounding periods per year
 * @returns Effective Annual Rate
 */
export function calculateEffectiveAnnualRate(
  nominalRate: number,
  compoundingPeriods: number
): number {
  return Math.pow(1 + nominalRate / compoundingPeriods, compoundingPeriods) - 1;
}

/**
 * Generate amortization schedule
 * @param principal - Loan amount
 * @param rate - Interest rate per period
 * @param periods - Number of periods
 * @returns Array of payment details
 */
export function generateAmortizationSchedule(
  principal: number,
  rate: number,
  periods: number
): Array<{
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const payment = calculateLoanPayment(principal, rate, periods);
  const schedule = [];
  let balance = principal;

  for (let period = 1; period <= periods; period++) {
    const interest = balance * rate;
    const principalPayment = payment - interest;
    balance -= principalPayment;

    schedule.push({
      period,
      payment,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
}

/**
 * Calculate the number of periods needed
 * n = ln(FV/PV) / ln(1 + r)
 * @param pv - Present Value
 * @param fv - Future Value
 * @param rate - Interest rate per period
 * @returns Number of periods
 */
export function calculatePeriods(
  pv: number,
  fv: number,
  rate: number
): number {
  return Math.log(fv / pv) / Math.log(1 + rate);
}

/**
 * Calculate the interest rate needed
 * r = (FV/PV)^(1/n) - 1
 * @param pv - Present Value
 * @param fv - Future Value
 * @param periods - Number of periods
 * @returns Interest rate per period
 */
export function calculateRate(pv: number, fv: number, periods: number): number {
  return Math.pow(fv / pv, 1 / periods) - 1;
}
