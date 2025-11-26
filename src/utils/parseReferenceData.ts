
export interface ParsedQuestion {
    id: number;
    question: string;
    answer: string;
    evidence?: string;
}

export interface ParsedCaseData {
    questions: Record<number, ParsedQuestion>;
    complaintText: string;
    characterProfileText: string;
    jobDescriptionText: string;
    actualDutiesText: string;
}

export const parseReferenceData = (markdown: string): ParsedCaseData => {
    const questions: Record<number, ParsedQuestion> = {};
    const lines = markdown.split('\n');
    let currentQuestionId: number | null = null;
    let currentQuestionText = '';
    let currentAnswerLines: string[] = [];

    const processCurrentQuestion = () => {
        if (currentQuestionId !== null) {
            const fullAnswer = currentAnswerLines.join('\n').trim();
            // Extract evidence if present (usually at the end starting with *Evidence:)
            const evidenceMatch = fullAnswer.match(/\*Evidence:(.*?)\*$/s) || fullAnswer.match(/\*Evidence:(.*?)$/s);
            let evidence = '';
            let answer = fullAnswer;

            if (evidenceMatch) {
                evidence = evidenceMatch[1].trim();
                answer = fullAnswer.replace(evidenceMatch[0], '').trim();
            }

            questions[currentQuestionId] = {
                id: currentQuestionId,
                question: currentQuestionText,
                answer: answer,
                evidence: evidence
            };
        }
    };

    for (const line of lines) {
        const questionMatch = line.match(/^### Question (\d+): (.*)/);
        if (questionMatch) {
            processCurrentQuestion();
            currentQuestionId = parseInt(questionMatch[1], 10);
            currentQuestionText = questionMatch[2].trim();
            currentAnswerLines = [];
        } else if (currentQuestionId !== null) {
            if (!line.trim().startsWith('---') && !line.trim().startsWith('## SECTION')) {
                currentAnswerLines.push(line);
            }
        }
    }
    processCurrentQuestion(); // Process the last one

    // Extract specific fields based on question numbers (mapping based on context)
    // Q1: Autism effects -> Character Profile
    // Q5: Manager response -> Character Profile
    // Q18: Complaint details -> Complaint Text
    // Q151: Job Description -> Job Description
    // Q152: Actual Duties -> Actual Duties

    const characterProfileText = [
        questions[1]?.answer,
        questions[5]?.answer,
        questions[150]?.answer // Character profile summary if exists
    ].filter(Boolean).join('\n\n');

    const complaintText = questions[18]?.answer || '';

    // Note: Adjust question IDs if the mapping in the file is different. 
    // Based on the file preview:
    // Q1 is "Describe how autism affects your ability to work"
    // Q5 is "How did Mark Hayes... respond..."

    // I'll use a best-effort mapping here.

    return {
        questions,
        complaintText,
        characterProfileText,
        jobDescriptionText: questions[151]?.answer || '',
        actualDutiesText: questions[152]?.answer || ''
    };
};
