import React, { useState, useEffect } from "react";

function App() {
  const today = new Date().toISOString().slice(0, 10);

  const [activeTab, setActiveTab] = useState("Pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);

  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [totalShortBreaks, setTotalShortBreaks] = useState(0);
  const [totalLongBreaks, setTotalLongBreaks] = useState(0);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("pomodoroData")) || {};
    if (savedData[today]) {
      setTotalPomodoros(savedData[today].pomodoros || 0);
      setTotalShortBreaks(savedData[today].shortBreaks || 0);
      setTotalLongBreaks(savedData[today].longBreaks || 0);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
    if (secondsLeft == 0) {
      if (activeTab === "Pomodoro") {
        setTotalPomodoros((prevPomodoros) => prevPomodoros + 1);
        setActiveTab("ShortBreak");
      } else if (activeTab === "ShortBreak") {
        setTotalShortBreaks((prevShortBreaks) => prevShortBreaks + 1);
        setActiveTab("Pomodoro");
      } else if (activeTab === "LongBreak") {
        setTotalLongBreaks((prevShortBreaks) => prevShortBreaks + 1);
        setActiveTab("Pomodoro");
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (activeTab === "Pomodoro") {
      setSecondsLeft(1500);
    } else if (activeTab === "ShortBreak") {
      setSecondsLeft(300);
    } else if (activeTab === "LongBreak") {
      setSecondsLeft(1800);
    }

    setIsRunning(false);
  }, [activeTab]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("pomodoroData")) || {};
    savedData[today] = {
      pomodoros: totalPomodoros,
      shortBreaks: totalShortBreaks,
      longBreaks: totalLongBreaks,
    };
    localStorage.setItem("pomodoroData", JSON.stringify(savedData));
  }, [totalPomodoros, totalShortBreaks, totalLongBreaks]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div className="flex justify-center items-center text-white h-[100vh]">
      <div className="rounded-lg bg-opacity-30 px-8 py-6 text-center bg-black">
        <div className="flex gap-2 justify-center text-xl">
          <span
            className={`cursor-pointer p-2 rounded-xl ${
              activeTab === "Pomodoro" && "bg-white bg-opacity-30 text-red-500"
            }`}
            onClick={() => setActiveTab("Pomodoro")}
          >
            Pomodoro
          </span>
          <span
            className={`cursor-pointer p-2 rounded-xl ${
              activeTab === "ShortBreak" &&
              "bg-white bg-opacity-30 text-red-500"
            }`}
            onClick={() => setActiveTab("ShortBreak")}
          >
            Short Break
          </span>
          <span
            className={`cursor-pointer p-2 rounded-xl ${
              activeTab === "LongBreak" && "bg-white bg-opacity-30 text-red-500"
            }`}
            onClick={() => setActiveTab("LongBreak")}
          >
            Long Break
          </span>
        </div>

        <div className="font-bold text-9xl py-8">{formatTime(secondsLeft)}</div>

        <button
          className="btn text-xl px-8 bg-opacity-10 cursor-pointer text-white"
          onClick={handleStartStop}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
      <div
        id="statistics"
        className="rounded-lg bg-opacity-30 px-8 py-6 bg-black text-lg absolute top-8 right-8"
      >
        <h2 className="text-xl text-orange-700 pb-3 text-center">
          <p>{today} </p>
          <p>statistics</p>
        </h2>
        <p className="pt-2 pb-1">Total Pomodoros: {totalPomodoros}</p>
        <hr />
        <p className="pt-2 pb-1">Total Short Breaks: {totalShortBreaks}</p>
        <hr />
        <p className="pt-2 pb-1">Total Long Breaks: {totalLongBreaks}</p>
        <hr />
      </div>
    </div>
  );
}

export default App;
