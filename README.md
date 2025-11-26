# Legal Case Review App

**AI-Powered Employment Law Case Analysis Tool**

This application provides comprehensive legal analysis for wrongful termination and employment law cases in Texas, with a focus on:

- **AI Case Analysis**: Deep investigation of employment law complaints using Gemini AI
- **Evidence Board**: Visual organization of evidence mapped to legal allegations
- **Strategy Dashboard**: Comprehensive response strategies and counter-arguments
- **Legal Questions Database**: 160+ structured questions with AI-powered confidence scoring
- **Case Law Research**: Dynamic research of relevant Texas case law (85%+ relevance threshold)
- **Document Generation**: Automated demand letters and settlement proposals

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **AI Integration**: Google Gemini 2.5 Pro (via `@google/genai`)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Charts**: Recharts

## Project Structure

```
src/
├── App.tsx                 # Main application component with 5-stage workflow
├── components/             # UI components
│   ├── AnalysisDisplay.tsx
│   ├── EvidenceBoard.tsx
│   ├── DemandLetter.tsx
│   ├── LegalQuestions/
│   │   ├── QuestionsView.tsx
│   │   └── QuestionCard.tsx
│   └── ...
├── services/
│   └── geminiService.ts    # AI integration for case analysis & case law research
├── data/
│   └── legalQuestions.ts   # 160 legal questions database
├── types.ts                # TypeScript type definitions
└── utils/                  # Helper utilities

public/
└── assets/
    └── documents/          # Reference documents and case files
```

## Key Features

### 1. **5-Stage Workflow**
- **Input**: Complaint details, job description, actual duties, character profile
- **Investigation**: AI-powered analysis of stated/unstated claims, information gaps
- **Evidence Board**: Drag-and-drop evidence organization with allegation mapping
- **Strategy Dashboard**: Response strategies, counter-arguments, evidence gathering
- **Conference Prep**: Good Faith Conference guide, document requests, draft communications

### 2. **AI Case Law Research** (New)
The app now includes a 2-stage AI research process:
- **Stage 1**: Analyzes Q&A to identify legal claims and generate follow-up questions
- **Stage 2**: Researches relevant Texas case law with 85%+ relevance scores
- Returns multiple case examples per claim with detailed holdings and relevance explanations

### 3. **Legal Questions Database**
160 structured questions covering:
- Employment history
- Discrimination & retaliation
- ADA accommodations
- Hostile work environment
- Documentation & evidence

Each question can be analyzed for:
- Confidence scoring (0-100)
- Missing evidence identification
- Follow-up question generation
- Relevant case law research

## Getting Started

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file with your Gemini API key:
```
API_KEY=your_gemini_api_key_here
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Archive

All PMAction, PMP, and shopping-related files have been moved to `_ARCHIVE_PMA_SHOPPING/` for reference.

## License

Private project for legal case analysis.
