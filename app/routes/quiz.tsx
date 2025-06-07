import React, { useState } from 'react';

const QuizPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState("What is 12 + 8?");
  const [options, setOptions] = useState(["18", "20", "22", "24"]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(2);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Selected answer:", selectedAnswer);
    // Further logic for checking answer, moving to next question, etc.
  };

  const handleCloseQuiz = () => {
    console.log("Closing quiz");
    // Navigate to home or another appropriate page
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
            className="text-[#111418] flex size-12 shrink-0 items-center justify-center" // Adjusted for button
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
            Math Quiz
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
          {currentQuestion}
        </h2>
        <div className="flex flex-wrap gap-3 p-4 justify-center"> {/* Added justify-center for better layout */}
          {options.map((option, index) => (
            <label
              key={index}
              className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dbe0e6] px-4 h-11 text-[#111418] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#0c7ff2] relative cursor-pointer"
            >
              {option}
              <input
                type="radio"
                className="invisible absolute"
                name="quizAnswer" // Static name for this group of radio buttons
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
          >
            <span className="truncate">Submit</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default QuizPage;
