export interface ParsedSyllabus {
  description: string;
  units: Array<{ id: string; title: string }>;
}

export async function parseSyllabus(filePath: string): Promise<ParsedSyllabus> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    description:
      "This course introduces core concepts and practical applications. You'll learn through lectures, exercises, and projects.",
    units: [
      { id: "unit-1", title: "Introduction" },
      { id: "unit-2", title: "Fundamentals" },
      { id: "unit-3", title: "Applied Practice" },
    ],
  };
}
