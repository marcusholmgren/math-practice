import { generateProblem, type Problem } from './game_engine';

describe('GameEngine - generateProblem', () => {
  describe('Level 1', () => {
    let problem: Problem;

    beforeEach(() => {
      problem = generateProblem('1');
    });

    test('should return a problem object with question, options, and correctAnswer', () => {
      expect(problem).toHaveProperty('question');
      expect(problem).toHaveProperty('options');
      expect(problem).toHaveProperty('correctAnswer');
    });

    test('question should be a string starting with "What is "', () => {
      expect(typeof problem.question).toBe('string');
      expect(problem.question.startsWith('What is ')).toBe(true);
    });

    test('options should be an array of 4 strings', () => {
      expect(Array.isArray(problem.options)).toBe(true);
      expect(problem.options.length).toBe(4);
      problem.options.forEach(option => {
        expect(typeof option).toBe('string');
      });
    });

    test('correctAnswer should be a string and one of the options', () => {
      expect(typeof problem.correctAnswer).toBe('string');
      expect(problem.options).toContain(problem.correctAnswer);
    });

    test('numbers in the question should be single digit (0-9)', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const num1 = parseInt(questionParts[1], 10);
        const num2 = parseInt(questionParts[3], 10);
        expect(num1).toBeGreaterThanOrEqual(0);
        expect(num1).toBeLessThanOrEqual(9);
        expect(num2).toBeGreaterThanOrEqual(0);
        expect(num2).toBeLessThanOrEqual(9);
      }
    });

    test('operation should be +, -, or *', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const operation = questionParts[2];
        expect(['+', '-', '*']).toContain(operation);
      }
    });

    test('correctAnswer should be the actual result of the operation', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const num1 = parseInt(questionParts[1], 10);
        const operation = questionParts[2];
        const num2 = parseInt(questionParts[3], 10);
        let expectedAnswer: number;
        if (operation === '+') {
          expectedAnswer = num1 + num2;
        } else if (operation === '-') {
          expectedAnswer = num1 - num2;
        } else { // operation === '*'
          expectedAnswer = num1 * num2;
        }
        expect(parseInt(problem.correctAnswer, 10)).toBe(expectedAnswer);
      }
    });
     test('options should not contain duplicate values', () => {
      const uniqueOptions = new Set(problem.options);
      expect(uniqueOptions.size).toBe(problem.options.length);
    });
  });

  describe('Level 2', () => {
    let problem: Problem;

    beforeEach(() => {
      problem = generateProblem('2');
    });

    test('should return a problem object', () => {
      expect(problem).toHaveProperty('question');
      expect(problem).toHaveProperty('options');
      expect(problem).toHaveProperty('correctAnswer');
    });

    test('options should be an array of 4 strings', () => {
      expect(Array.isArray(problem.options)).toBe(true);
      expect(problem.options.length).toBe(4);
    });

    test('correctAnswer should be one of the options', () => {
      expect(problem.options).toContain(problem.correctAnswer);
    });

    test('numbers in the question should be two digits (10-99)', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const num1 = parseInt(questionParts[1], 10);
        const num2 = parseInt(questionParts[3], 10);
        expect(num1).toBeGreaterThanOrEqual(10);
        expect(num1).toBeLessThanOrEqual(99);
        expect(num2).toBeGreaterThanOrEqual(10);
        expect(num2).toBeLessThanOrEqual(99);
      }
    });

    test('operation should be +, -, or *', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const operation = questionParts[2];
        expect(['+', '-', '*']).toContain(operation);
      }
    });

    test('correctAnswer should be the actual result of the operation', () => {
      const questionParts = problem.question.match(/(\d+)\s*([+\-*])\s*(\d+)/);
      expect(questionParts).not.toBeNull();
      if (questionParts) {
        const num1 = parseInt(questionParts[1], 10);
        const operation = questionParts[2];
        const num2 = parseInt(questionParts[3], 10);
        let expectedAnswer: number;
        if (operation === '+') {
          expectedAnswer = num1 + num2;
        } else if (operation === '-') {
          expectedAnswer = num1 - num2;
        } else { // operation === '*'
          expectedAnswer = num1 * num2;
        }
        expect(parseInt(problem.correctAnswer, 10)).toBe(expectedAnswer);
      }
    });

    test('options should not contain duplicate values', () => {
      const uniqueOptions = new Set(problem.options);
      expect(uniqueOptions.size).toBe(problem.options.length);
    });
  });

  test('should throw error for invalid level', () => {
    expect(() => generateProblem('3')).toThrow("Invalid level specified. Choose '1' or '2'.");
  });
});
