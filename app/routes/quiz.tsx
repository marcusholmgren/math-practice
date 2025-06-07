import React, { useState, useEffect } from "react";
import type { Route } from "./+types/quiz";
import { useNavigate, useParams } from "react-router";
import { generateProblem, type Problem } from "../game_engine"; // Import Problem type and function

// Update LoaderArgs to reflect that it will return a Problem
export interface QuizLoaderArgs extends Route.LoaderArgs {
  // Add any specific loader args if needed, otherwise, it inherits from Route.LoaderArgs
}

// Update clientLoader to use generateProblem and return a Problem
export async function clientLoader({ params }: QuizLoaderArgs) {
  const mode = params.mode || "1"; // Default to level 1 if mode is not specified
  const problem = generateProblem(mode);
  return { problem, mode }; // Return the problem object and mode
}

// Update ComponentProps to expect a 'problem' object and 'mode'
export interface QuizComponentProps extends Route.ComponentProps {
  loaderData: {
    problem: Problem;
    mode: string;
  };
}

function QuizPage({ loaderData }: QuizComponentProps) {
  const navigate = useNavigate();
  const { mode: routeMode } = useParams<{ mode: string }>(); // Get mode from route params for fetching new questions

  const [currentProblem, setCurrentProblem] = useState<Problem>(loaderData.problem);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(2);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5); // Can be made dynamic later

  // Effect to update state if loaderData changes (e.g., on navigation or HMR)
  useEffect(() => {
    setCurrentProblem(loaderData.problem);
    // Reset attempts for a new problem if needed, or manage globally
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
      if (questionNumber < totalQuestions) {
        setQuestionNumber(questionNumber + 1);
        const nextProblem = generateProblem(routeMode || "1"); // Use routeMode
        setCurrentProblem(nextProblem);
        setSelectedAnswer("");
        // Reset attempts for next question if desired
        // setAttemptsRemaining(2);
      } else {
        // Last question answered correctly
        navigate("/summary"); // Or pass some state like { score: ... }
      }
    } else {
      setAttemptsRemaining(attemptsRemaining - 1);
      if (attemptsRemaining - 1 <= 0) {
        // Out of attempts
        alert(`Out of attempts! The correct answer was: ${currentProblem.correctAnswer}`);
        navigate("/summary"); // Or some other logic
      } else {
        alert("Incorrect answer. Try again!");
      }
    }
  };

  const handleCloseQuiz = () => {
    navigate("/");
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
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Math Quiz - Level {routeMode}
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
            disabled={!selectedAnswer} // Disable button if no answer is selected
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
