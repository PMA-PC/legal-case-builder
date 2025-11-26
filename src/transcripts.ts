export interface TranscriptSegment {
    speaker: string;
    text: string;
    timestamp: string;
    annotation?: string;
}

export const DIFFICULT_CONVERSATION_TRANSCRIPT: TranscriptSegment[] = [
    {
        speaker: "Manager",
        text: "We need to discuss your recent performance...",
        timestamp: "00:00:10",
        annotation: "Opening statement sets a negative tone."
    },
    {
        speaker: "Joshua",
        text: "I understand, but I've been asking for accommodations...",
        timestamp: "00:00:45",
        annotation: "Employee attempts to raise protected concerns."
    },
    {
        speaker: "Manager",
        text: "This isn't about accommodations, it's about your behavior.",
        timestamp: "00:01:15",
        annotation: "Manager dismisses accommodation request, potentially violating ADA."
    }
];
