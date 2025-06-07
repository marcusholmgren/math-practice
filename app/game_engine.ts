interface Problem {
  question: string;
  options: string[];
  correctAnswer: string;
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(level: string): Problem {
  let num1: number;
  let num2: number;
  const operations = ['+', '-', '*'];
  const operation = operations[generateRandomNumber(0, operations.length - 1)];

  if (level === "1") {
    num1 = generateRandomNumber(0, 9);
    num2 = generateRandomNumber(0, 9);
    // Ensure num1 is greater than or equal to num2 for subtraction to avoid negative results for now
    if (operation === '-' && num1 < num2) {
      [num1, num2] = [num2, num1]; // Swap numbers
    }
  } else if (level === "2") {
    num1 = generateRandomNumber(10, 99);
    num2 = generateRandomNumber(10, 99);
     // Ensure num1 is greater than or equal to num2 for subtraction to avoid negative results for now
    if (operation === '-' && num1 < num2) {
      [num1, num2] = [num2, num1]; // Swap numbers
    }
  } else {
    throw new Error("Invalid level specified. Choose '1' or '2'.");
  }

  let correctAnswerValue: number;
  switch (operation) {
    case '+':
      correctAnswerValue = num1 + num2;
      break;
    case '-':
      correctAnswerValue = num1 - num2;
      break;
    case '*':
      correctAnswerValue = num1 * num2;
      break;
    default:
      throw new Error("Invalid operation"); // Should not happen
  }

  const question = `What is ${num1} ${operation} ${num2}?`;
  const correctAnswer = correctAnswerValue.toString();
  const options: string[] = [correctAnswer];

  // Generate 3 distractor options
  while (options.length < 4) {
    let distractor: string;
    const variation = generateRandomNumber(1, 10); // How much the distractor varies
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    let distractorValue = correctAnswerValue + (plusOrMinus * variation);

    // Ensure distractor is non-negative and different from correct answer and other options
    if (distractorValue < 0) {
        distractorValue = correctAnswerValue + variation; // try adding if subtraction made it negative
    }
    distractor = distractorValue.toString();

    if (!options.includes(distractor)) {
      options.push(distractor);
    }
  }

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    question,
    options,
    correctAnswer,
  };
}

export { generateProblem };
export type { Problem };
