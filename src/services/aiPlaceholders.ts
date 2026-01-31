/**
 * AI Placeholders - Mock functions for future AI integration
 * These will be replaced with actual AI API calls in the future
 */

export interface ParsedSyllabus {
  description: string;
  units: {
    title: string;
    weekNumber?: number;
  }[];
}

/**
 * Mock syllabus parser - simulates AI extraction of course info
 * In production, this would send the file to an AI service
 */
export async function parseSyllabus(
  file: File | null,
): Promise<ParsedSyllabus> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data
  return {
    description:
      "This course covers fundamental concepts and practical applications. Students will learn through lectures, assignments, and projects.",
    units: [
      { title: "Introduction and Fundamentals", weekNumber: 1 },
      { title: "Core Concepts", weekNumber: 2 },
      { title: "Advanced Topics", weekNumber: 3 },
      { title: "Practical Applications", weekNumber: 4 },
      { title: "Review and Assessment", weekNumber: 5 },
    ],
  };
}
