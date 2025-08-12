import { useNavigate, useSearchParams } from "react-router";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useState, useEffect } from "react";

export async function clientLoader() {
  return {}; // Loader no longer needs to handle query params
}

function SummaryPage() {
  const [searchParams] = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0", 10);
  const total = parseInt(searchParams.get("total") || "0", 10);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(
    total > 0 && score / total >= 0.8
  );

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleCloseSummary = () => {
    console.log("Closing summary");
    // For now, navigate to home or another appropriate page
    // e.g., window.location.href = "/";
    navigate("/", { viewTransition: true });
  };

  const handleContinue = () => {
    console.log("Continuing from summary");
    // For now, navigate to home or another appropriate page
    // e.g., window.location.href = "/";
    navigate("/", { viewTransition: true });
  };

  return (
    <div
      className="relative flex size-full min-h-[100dvh] flex-col bg-white group/design-root overflow-x-auto"
      style={{
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif',
      }}
    >
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={showConfetti ? 200 : 0}
      />
      {/* Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <button
          onClick={handleCloseSummary}
          className="text-[#111418] flex size-12 shrink-0 items-center justify-center" // Adjusted for button
          aria-label="Close summary"
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
          Summary
        </h2>
      </div>
      
      {/* Main content area (grows to fill available space) */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          You got {score} out of {total} correct
        </h2>
        <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          {total > 0 && score / total >= 0.8
            ? "Congratulations! You're a math wizard!"
            : "You're doing great! Keep practicing to improve your math skills."}
        </p>
        
        {/* Spacer that pushes button to bottom */}
        <div className="flex-1"></div>
      </div>
      {/* Footer with button */}
      <div className="mt-auto">
        <div className="flex px-4 py-3 justify-center">
          <button
            onClick={handleContinue}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#0c7ff2] text-white text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Continue</span>
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom,5px)] bg-white"></div>
      </div>
    </div>
  );
}

export default SummaryPage;
