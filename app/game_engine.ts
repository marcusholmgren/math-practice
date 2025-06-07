export interface Problem {
  question: string;
  options: string[];
  correctAnswer: string;
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate a non-zero divisor and a dividend that's a multiple of it
function generateDivisionNumbers(level: string): { num1: number; num2: number } {
  let num1: number, num2: number;
  if (level === "1") {
    num2 = generateRandomNumber(1, 9); // Divisor 1-9
    num1 = num2 * generateRandomNumber(0, Math.floor(9 / num2)); // Ensure num1 is multiple and within 0-9 range
  } else { // Level "2"
    num2 = generateRandomNumber(1, 9); // Divisor 1-9 for simplicity for now
    num1 = num2 * generateRandomNumber(0, Math.floor(99 / num2)); // Ensure num1 is multiple and within 0-99 range
  }
  return { num1, num2 };
}

export function generateProblem(level: string, operationType: string): Problem {
  let num1: number;
  let num2: number;
  let operationSymbol: string;

  switch (operationType.toLowerCase()) {
    case 'addition':
      operationSymbol = '+';
      if (level === "1") {
        num1 = generateRandomNumber(0, 9);
        num2 = generateRandomNumber(0, 9);
      } else { // Level "2"
        num1 = generateRandomNumber(10, 99);
        num2 = generateRandomNumber(10, 99);
      }
      break;
    case 'subtraction':
      operationSymbol = '-';
      if (level === "1") {
        num1 = generateRandomNumber(0, 9);
        num2 = generateRandomNumber(0, num1); // Ensures num2 <= num1
      } else { // Level "2"
        num1 = generateRandomNumber(10, 99);
        num2 = generateRandomNumber(10, num1); // Ensures num2 <= num1
      }
      break;
    case 'multiplication':
      operationSymbol = '*';
      if (level === "1") {
        num1 = generateRandomNumber(0, 9);
        num2 = generateRandomNumber(0, 9);
      } else { // Level "2"
        // Adjust range to keep products from getting too large for options generation
        num1 = generateRandomNumber(0, 20);
        num2 = generateRandomNumber(0, 20);
        if (num1 < 10 && num2 < 10) { // Ensure at least one is two-digit if possible, or make them larger
            if (Math.random() < 0.5) {
                num1 = generateRandomNumber(10,20);
            } else {
                num2 = generateRandomNumber(10,20);
            }
        }
      }
      break;
    case 'division':
      operationSymbol = '/';
      const divisionNums = generateDivisionNumbers(level);
      num1 = divisionNums.num1;
      num2 = divisionNums.num2;
      break;
    default:
      throw new Error(`Invalid operation type: ${operationType}. Choose 'addition', 'subtraction', 'multiplication', or 'division'.`);
  }

  let correctAnswerValue: number;
  switch (operationSymbol) {
    case '+':
      correctAnswerValue = num1 + num2;
      break;
    case '-':
      correctAnswerValue = num1 - num2;
      break;
    case '*':
      correctAnswerValue = num1 * num2;
      break;
    case '/':
      if (num2 === 0) throw new Error("Division by zero."); // Should be caught by generateDivisionNumbers
      correctAnswerValue = num1 / num2;
      break;
    default:
      throw new Error("Invalid operation symbol"); // Should not happen
  }

  const question = `What is ${num1} ${operationSymbol} ${num2}?`;
  const correctAnswer = correctAnswerValue.toString();
  const options: string[] = [correctAnswer];

  // Generate 3 distractor options
  while (options.length < 4) {
    let distractorValue: number;
    const variation = generateRandomNumber(1, 10);
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    if (correctAnswerValue > 5 && Math.random() < 0.3) { // 30% chance of multiplicative distractor if answer is reasonable
        const multiplier = Math.random() < 0.5 ? 0.5 : 1.5;
        distractorValue = Math.round(correctAnswerValue * multiplier);
    } else { // Additive distractor
        distractorValue = correctAnswerValue + (plusOrMinus * variation);
    }

    // Ensure distractor is non-negative for simplicity, and different
    if (operationSymbol === '/' && correctAnswerValue > 0) { // For division, try to keep distractors with similar decimal places or as whole numbers
        if (Number.isInteger(correctAnswerValue)) {
            distractorValue = Math.round(distractorValue);
        } else {
            // If answer has decimals, try to make distractors have similar precision
            const precision = correctAnswer.split('.')[1]?.length || 0;
            distractorValue = parseFloat(distractorValue.toFixed(precision));
        }
    } else { // For other ops, or if division result is 0
       distractorValue = Math.max(0, Math.round(distractorValue)); // Ensure non-negative and round
    }


    const distractor = distractorValue.toString();
    if (!options.includes(distractor) && distractor !== correctAnswer) {
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
