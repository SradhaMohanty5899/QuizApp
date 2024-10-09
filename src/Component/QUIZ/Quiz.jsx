import React, { useState, useEffect, useCallback } from "react";
import './quiz.css';
import { data } from "../../data";

export default function Quiz() {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const [lock, setLock] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); // Timer for each question

    const currentQuestion = data[index];

    // Function to handle moving to the next question
    const nextQuestion = useCallback(() => {
        setLock(false);
        setSelectedAnswer(null);
        setTimeLeft(10); // Reset timer for the next question

        if (index < data.length - 1) {
            setIndex(index + 1);
        } else {
            setIsLastPage(true);
        }
    }, [index]); // Include index as a dependency

    // Timer logic
    useEffect(() => {
        if (timeLeft === 0) {
            nextQuestion(); // Auto move to next question when timer runs out
        }
        const timer = timeLeft > 0 && setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, nextQuestion]); // Include nextQuestion in dependencies

    const checkAnswer = (ans, i) => {
        if (!lock) {
            setSelectedAnswer(i);
            if (ans === currentQuestion.ans) {
                setScore(score + 1);
            }
            setLock(true);
        }
    };

    const restartQuiz = () => {
        setIndex(0);
        setScore(0);
        setIsLastPage(false);
        setTimeLeft(10);
    };

    if (isLastPage) {
        return (
            <div className="quiz">
                <h2>Quiz Completed!</h2>
                <p>Your score: {score}/{data.length}</p>
                <button onClick={restartQuiz}>Restart Quiz</button>
                <div className="results">
                    <h3>Correct Answers:</h3>
                    <ul>
                        {data.map((q, i) => (
                            <li key={i}>
                                <strong>Q: {q.question}</strong><br />
                                Correct Answer: {q[`option${q.ans}`]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz">
            <h1>Java Quiz</h1>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${((index + 1) / data.length) * 100}%` }}></div>
            </div>
            <h3>{currentQuestion.question}</h3>
            <ul>
                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, i) => (
                    <li
                        key={i}
                        onClick={() => checkAnswer((i + 1).toString(), i)}
                        className={selectedAnswer === i ? (currentQuestion.ans === (i + 1).toString() ? 'correct' : 'incorrect') : ''}
                        style={{ pointerEvents: lock ? 'none' : 'auto' }} // Disable after selection
                    >
                        {option}
                    </li>
                ))}
            </ul>
            <button onClick={nextQuestion} disabled={!lock}>NEXT</button>
            <p>Question: {index + 1} of {data.length}</p>
            <p>Time left: {timeLeft} seconds</p>
        </div>
    );
}
