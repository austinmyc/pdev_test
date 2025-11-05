# Time Value of Money - Interactive Learning Platform

An interactive Next.js-based teaching application for understanding the Time Value of Money (TVM) concept in finance. Designed for undergraduate-level finance education.

## Features

### 📚 Educational Content
- Comprehensive introduction to TVM concepts
- Key formulas and explanations
- Real-world examples and applications
- Quick reference guide

### 🧮 Interactive Calculators
- **Future Value Calculator** - Calculate investment growth
- **Present Value Calculator** - Determine today's value of future money
- **Annuity Calculator** - Both ordinary and due annuities
- **Loan Payment Calculator** - Mortgage payments with amortization schedule
- **NPV & IRR Calculator** - Project evaluation tools

### 📊 Visual Demonstrations
- Investment growth over time
- Interest rate comparison charts
- Annuity growth visualization
- Principal vs. interest composition

### ✏️ Practice Problems
- 10 interactive problems covering all TVM concepts
- Multiple choice and calculation questions
- Instant feedback with detailed explanations
- Progress tracking and scoring

## Tech Stack

- **Frontend:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page with TVM overview
│   ├── calculators/          # Interactive calculators
│   ├── visualizations/       # Charts and graphs
│   ├── practice/             # Quiz and practice problems
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── tvmCalculations.ts    # TVM calculation functions
│   └── formatters.ts         # Utility formatting functions
├── components/               # Reusable React components
└── public/                   # Static assets
```

## Key Concepts Covered

1. **Present Value (PV)** - Current worth of future money
2. **Future Value (FV)** - Future worth of current money
3. **Interest Rates** - Time value and compounding
4. **Annuities** - Series of equal payments
5. **Net Present Value (NPV)** - Project evaluation
6. **Internal Rate of Return (IRR)** - Investment returns
7. **Loan Amortization** - Payment schedules

## Deployment

### Vercel (Recommended)

This app is optimized for Vercel deployment:

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with zero configuration

The application is fully stateless and supports concurrent users without any backend dependencies.

### Other Platforms

Can also be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting platform

## Concurrent User Support

This application is designed to handle multiple concurrent users:
- **Stateless Architecture** - No server-side state
- **Client-Side Calculations** - All computations run in browser
- **No Database Required** - Pure computational application
- **CDN-Friendly** - Static generation compatible

## Educational Use

This platform is ideal for:
- Undergraduate finance courses
- Corporate training sessions
- Self-paced learning
- Classroom demonstrations
- Homework assignments

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For questions or support, please open an issue on the GitHub repository.
