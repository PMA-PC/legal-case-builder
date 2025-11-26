# Legal App Migration Plan

This file outlines the plan to migrate the Legal App from a vanilla JavaScript application to a modern Vite + React + TypeScript project.

## 1. Project Setup

- [ ] Initialize a new Vite + React + TypeScript project.
- [ ] Install necessary dependencies from `config.js` (react, react-dom, etc.).
- [ ] Create the `src` directory and the basic project structure.

## 2. Component Migration

- [ ] Create React components (`.tsx` files) for each major UI element:
  - [ ] `App.tsx` (main application component)
  - [ ] `Auth.tsx` (authentication form)
  - [ ] `Header.tsx`
  - [ ] `Tabs.tsx`
  - [ ] `CaseBuilder.tsx`
  - [ ] `Timeline.tsx`
  - [ ] `LegalResearch.tsx`
  - [ ] `Analysis.tsx`
  - [ ] `MeetingPrep.tsx`
  - [ ] `Export.tsx`
- [ ] Port the existing HTML and JavaScript logic into these components.

## 3. Data & State Management

- [ ] Implement state management within the React components to handle the `caseData`, `timelineEvents`, and `evidenceFiles`.
- [ ] Connect the components to the Firebase backend for data persistence (Firestore and Firebase Storage).
- [ ] Ensure data is loaded on login and saved in real-time.

## 4. Styling

- [ ] Integrate the existing `style.css` with the new React components, likely using CSS Modules or a similar approach to scope styles.
- [ ] Ensure the light/dark theme functionality is preserved.

## 5. Finalization

- [ ] Replace the old `index.html`, `app.js`, and `style.css` with the new React application.
- [ ] Ensure the application is fully functional and ready for deployment.
