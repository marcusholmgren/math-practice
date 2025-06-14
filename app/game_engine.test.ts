import { describe, test, expect } from 'vitest';
import { generateProblem, type Problem } from './game_engine';

describe('GameEngine - generateProblem', () => {
  // Helper function to validate problem structure
  const validateProblemStructure = (problem: Problem, expectedOperationSymbol?: string) => {
    expect(problem).toHaveProperty('question');
    expect(typeof problem.question).toBe('string');
    expect(problem.question.startsWith('What is ')).toBe(true);
    if (expectedOperationSymbol) {
      expect(problem.question).toContain(` ${expectedOperationSymbol} `);
    }

    expect(problem).toHaveProperty('options');
    expect(Array.isArray(problem.options)).toBe(true);
    expect(problem.options.length).toBe(4);
    problem.options.forEach(option => expect(typeof option).toBe('string'));
    const uniqueOptions = new Set(problem.options);
    expect(uniqueOptions.size).toBe(problem.options.length); // Check for uniqueness

    expect(problem).toHaveProperty('correctAnswer');
    expect(typeof problem.correctAnswer).toBe('string');
    expect(problem.options).toContain(problem.correctAnswer);
  };

  // Helper function to validate number ranges
  const validateNumberRanges = (question: string, level: string, operation: string) => {
    const match = question.match(/(\d+)\s*[+\-*/]\s*(\d+)/);
    if (!match) throw new Error('Could not parse question: ' + question);
    const num1 = parseInt(match[1], 10);
    const num2 = parseInt(match[2], 10);

    if (level === '1') {
      if (operation === 'division') {
        expect(num1).toBeGreaterThanOrEqual(0);
        expect(num1).toBeLessThanOrEqual(81); // Max for level 1 division (e.g. 9*9)
        expect(num2).toBeGreaterThanOrEqual(1); // Divisor by zero handled by engine
        expect(num2).toBeLessThanOrEqual(9);
      } else { // Add, Sub, Mul for Level 1
        expect(num1).toBeGreaterThanOrEqual(0);
        expect(num1).toBeLessThanOrEqual(9);
        expect(num2).toBeGreaterThanOrEqual(0);
        expect(num2).toBeLessThanOrEqual(9);
        if (operation === 'subtraction') {
            expect(num1).toBeGreaterThanOrEqual(num2);
        }
      }
    } else if (level === '2') {
      if (operation === 'division') {
        // num1 can be 0-99, num2 is 1-9
        expect(num1).toBeGreaterThanOrEqual(0);
        expect(num1).toBeLessThanOrEqual(99);
        expect(num2).toBeGreaterThanOrEqual(1);
        expect(num2).toBeLessThanOrEqual(9);
      } else if (operation === 'multiplication') {
        // Level 2 multiplication uses numbers 0-20
        expect(num1).toBeGreaterThanOrEqual(0);
        expect(num1).toBeLessThanOrEqual(20);
        expect(num2).toBeGreaterThanOrEqual(0);
        expect(num2).toBeLessThanOrEqual(20);
      }else { // Add, Sub for Level 2
        expect(num1).toBeGreaterThanOrEqual(10);
        expect(num1).toBeLessThanOrEqual(99);
        expect(num2).toBeGreaterThanOrEqual(10);
        expect(num2).toBeLessThanOrEqual(99);
         if (operation === 'subtraction') {
            expect(num1).toBeGreaterThanOrEqual(num2);
        }
      }
    }
  };

  const operations: {name: string, symbol: string}[] = [
      {name: 'addition', symbol: '+'},
      {name: 'subtraction', symbol: '-'},
      {name: 'multiplication', symbol: '*'},
      {name: 'division', symbol: '/'},
  ];
  
  // Add capitalize method to String prototype for cleaner operation name formatting
  declare global {
    interface String {
      capitalize(): string;
    }
  }
  
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  ['1', '2'].forEach(level => {
    describe(`Level ${level}`, () => {
      operations.forEach(op => {
        describe(`${op.name.capitalize()}`, () => {
          let problem: Problem;
          const runCount = 10; // Run tests multiple times due to randomness

          // Before each specific test, generate a problem for that op and level
          // Some tests might need to run multiple times to cover randomness, so problem is generated inside `test` for those

          test(`should return a valid problem structure for ${op.name}`, () => {
            for (let i = 0; i < runCount; i++) {
                problem = generateProblem(level, op.name);
                validateProblemStructure(problem, op.symbol);
            }
          });

          test(`numbers should be in the correct range for ${op.name}`, () => {
             for (let i = 0; i < runCount; i++) {
                problem = generateProblem(level, op.name);
                validateNumberRanges(problem.question, level, op.name);
             }
          });

          test(`correctAnswer should be the actual result for ${op.name}`, () => {
            for (let i = 0; i < runCount; i++) {
                problem = generateProblem(level, op.name);
                const match = problem.question.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
                if (!match) throw new Error('Could not parse question for calculation test');
                const num1 = parseInt(match[1], 10);
                const symbol = match[2];
                const num2 = parseInt(match[3], 10);
                let expectedAnswer: number;

                switch (symbol) {
                    case '+': expectedAnswer = num1 + num2; break;
                    case '-': expectedAnswer = num1 - num2; break;
                    case '*': expectedAnswer = num1 * num2; break;
                    case '/':
                        if (num2 === 0) { // Should not happen due to engine logic
                            console.error("Test encountered division by zero in question:", problem.question);
                            // Skip this specific random case if engine failed to prevent it, error out test
                            expect(num2).not.toBe(0);
                            return;
                        }
                        expectedAnswer = num1 / num2;
                        break;
                    default: throw new Error('Unknown operation symbol in test');
                }
                expect(parseFloat(problem.correctAnswer)).toBeCloseTo(expectedAnswer, 5); // Use toBeCloseTo for division, though it should be exact
                if (op.name === 'division') {
                    expect(Number.isInteger(parseFloat(problem.correctAnswer))).toBe(true); // Expect whole number for division
                }
            }
          });

          if (op.name === 'division') {
            test('divisor (num2) should not be zero for division', () => {
              for (let i = 0; i < runCount; i++) {
                  problem = generateProblem(level, op.name);
                  const match = problem.question.match(/(\d+)\s*\/\s*(\d+)/);
                  if (!match) throw new Error('Could not parse division question');
                  const num2 = parseInt(match[2], 10);
                  expect(num2).not.toBe(0);
              }
            });
          }
        });
      });
    });
  });

  test('should throw error for invalid operation type', () => {
    expect(() => generateProblem('1', 'modulo')).toThrow("Invalid operation type: modulo. Choose 'addition', 'subtraction', 'multiplication', or 'division'.");
  });

  // Current implementation doesn't explicitly validate level parameter
  // This test is commented out as a reminder that level validation could be added
  // test('should throw error for invalid level', () => {
  //   expect(() => generateProblem('3', 'addition')).toThrow("Invalid level");
  // });
});
