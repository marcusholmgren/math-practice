import React, { useState, useEffect } from "react";
import type { Route } from "./+types/quiz";
import { useNavigate } from "react-router";
import { generateProblem, type Problem } from "../game_engine";

export interface QuizLoaderArgs extends Route.LoaderArgs {
  // Route.LoaderArgs already includes params: { mode: string }
}

export async function clientLoader({ params }: QuizLoaderArgs) {
  const operationType = params.mode || "addition"; // Default to level 1 addition
  //const [level, operationType] = mode.split('-');
  const level = "1";

  if (!level || !operationType) {
    // Handle invalid mode format, perhaps throw an error or default
    console.error(
      "Invalid mode format. Expected 'level-operationType'. Defaulting..."
    );
    const problem = generateProblem("1", operationType);
    return { problem, level: "1", operationType: operationType };
  }

  const problem = generateProblem(level, operationType);
  return { problem, level, operationType };
}

export interface QuizComponentProps extends Route.ComponentProps {
  loaderData: {
    problem: Problem;
    level: string;
    operationType: string;
  };
}

function QuizPage({ loaderData }: QuizComponentProps) {
  const navigate = useNavigate();
  // useParams can be used if we need to access parts of the path directly,
  // but loaderData should provide what we need (level, operationType)
  // const { mode: routeMode } = useParams<{ mode: string }>();

  const [currentProblem, setCurrentProblem] = useState<Problem>(
    loaderData.problem
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(2);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5); // Can be made dynamic later
  const [score, setScore] = useState(0);

  // Current level and operation type from loaderData
  const { level, operationType } = loaderData;

  useEffect(() => {
    setCurrentProblem(loaderData.problem);
    // Reset attempts or other states when a new problem is loaded via loader
    // setAttemptsRemaining(2); // Example: Reset attempts for each new problem from loader
    // setQuestionNumber(1); // Might be needed if the loader is re-run for a new quiz type
  }, [loaderData.problem]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    if (selectedAnswer === currentProblem.correctAnswer) {
      setScore(score + 1);
      if (questionNumber < totalQuestions) {
        setQuestionNumber(questionNumber + 1);
        // Generate next problem using the level and operationType from loaderData
        const nextProblem = generateProblem(level, operationType);
        setCurrentProblem(nextProblem);
        setSelectedAnswer("");
        // setAttemptsRemaining(2); // Optionally reset attempts for the next question
      } else {
        navigate(`/summary?score=${score + 1}&total=${totalQuestions}`, {
          viewTransition: true,
        });
      }
    } else {
      setAttemptsRemaining(attemptsRemaining - 1);
      if (attemptsRemaining - 1 < 0) {
        // Check if attempts will be less than 0
        alert(
          `Out of attempts! The correct answer was: ${currentProblem.correctAnswer}`
        );
        navigate(`/summary?score=${score}&total=${totalQuestions}`, {
          viewTransition: true,
        });
      } else {
        alert("Incorrect answer. Try again!");
      }
    }
  };

  const handleCloseQuiz = () => {
    navigate("/", { viewTransition: true });
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden"
      style={{
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif',
      }}
    >
      <div>
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <button
            onClick={handleCloseQuiz}
            className="text-[#111418] flex size-12 shrink-0 items-center justify-center"
            aria-label="Close quiz"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#111418] text-lg font-bold capitalize leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Math Quiz - Level {level} ({operationType})
          </h2>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between">
            <p className="text-[#111418] text-base font-medium leading-normal">
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>
          <div className="rounded bg-[#dbe0e6]">
            <div
              className="h-2 rounded bg-[#111418]"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          {currentProblem.question}
        </h2>
        <div className="flex flex-wrap gap-3 p-4 justify-center">
          {currentProblem.options.map((option, index) => (
            <label
              key={index}
              className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dbe0e6] px-4 h-11 text-[#111418] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#0c7ff2] relative cursor-pointer"
            >
              {option}
              <input
                type="radio"
                className="invisible absolute"
                name="quizAnswer"
                value={option}
                checked={selectedAnswer === option}
                onChange={handleAnswerChange}
              />
            </label>
          ))}
        </div>
        <p className="text-[#60758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Attempts remaining: {attemptsRemaining}
        </p>
      </div>
      <div>
        <div className="flex px-4 py-3">
          <button
            onClick={handleSubmit}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            disabled={!selectedAnswer}
          >
            <span className="truncate">Submit</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
}

export default QuizPage;
