import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { QUESTIONS, TOPICS, topicFor } from "./questions";
import "./styles.css";

const STORAGE_KEY = "cloudready-progress-v1";
const initialProgress = {
  answered: {},
  sessions: 0,
  bestScore: 0,
  completed: [],
};
function loadProgress() {
  try {
    return {
      ...initialProgress,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return initialProgress;
  }
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [progress, setProgress] = useState(loadProgress);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [quiz, setQuiz] = useState(null);
  const [coachMessages, setCoachMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! I’m your CloudPrep coach. Ask me about an Azure concept, or tell me which question confused you. I’ll explain it in plain language.",
    },
  ]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachMode, setCoachMode] = useState("demo");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const answeredEntries = Object.values(progress.answered);
  const totalAnswered = answeredEntries.length;
  const overallAccuracy = totalAnswered
    ? Math.round(
        (answeredEntries.filter((a) => a.correct).length / totalAnswered) * 100,
      )
    : 0;
  const topicStats = useMemo(
    () =>
      TOPICS.map((topic) => {
        const items = answeredEntries.filter((a) => a.topic === topic.id);
        return {
          ...topic,
          attempted: items.length,
          correct: items.filter((a) => a.correct).length,
          accuracy: items.length
            ? Math.round(
                (items.filter((a) => a.correct).length / items.length) * 100,
              )
            : 0,
        };
      }),
    [progress],
  );
  const weakestTopic = [...topicStats]
    .filter((t) => t.attempted > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  const startQuiz = (topicId = selectedTopic) => {
    const pool = QUESTIONS.filter(
      (q) => topicId === "all" || q.topic === topicId,
    );
    const questions = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, pool.length));
    setSelectedTopic(topicId);
    setQuiz({ questions, index: 0, answers: {}, finished: false });
    setPage("quiz");
  };

  const chooseAnswer = (optionIndex) => {
    if (!quiz || quiz.finished) return;
    const q = quiz.questions[quiz.index];
    if (quiz.answers[q.id] !== undefined) return;
    const correct = optionIndex === q.answer;
    setQuiz((old) => ({
      ...old,
      answers: { ...old.answers, [q.id]: optionIndex },
    }));
    setProgress((old) => ({
      ...old,
      answered: {
        ...old.answered,
        [q.id]: {
          topic: q.topic,
          correct,
          selected: optionIndex,
          lastSeen: new Date().toISOString(),
        },
      },
    }));
  };

  const finishQuiz = () => {
    if (!quiz) return;
    const score = quiz.questions.filter(
      (q) => quiz.answers[q.id] === q.answer,
    ).length;
    setProgress((old) => ({
      ...old,
      sessions: old.sessions + 1,
      bestScore: Math.max(
        old.bestScore,
        Math.round((score / quiz.questions.length) * 100),
      ),
      completed: [
        ...old.completed,
        { at: new Date().toISOString(), score, total: quiz.questions.length },
      ],
    }));
    setQuiz((old) => ({ ...old, finished: true, score }));
  };

  const askCoach = async (event) => {
    event?.preventDefault();
    const message = coachInput.trim();
    if (!message || coachLoading) return;
    const next = [...coachMessages, { role: "user", content: message }];
    setCoachMessages(next);
    setCoachInput("");
    setCoachLoading(true);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: next.slice(-8) }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "The coach is unavailable right now.");
      setCoachMode(data.mode || "ai");
      setCoachMessages((old) => [
        ...old,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setCoachMessages((old) => [
        ...old,
        {
          role: "assistant",
          content: `${error.message} You can continue practising while we fix this.`,
        },
      ]);
    } finally {
      setCoachLoading(false);
    }
  };

  const resetProgress = () => {
    if (window.confirm("Reset all saved practice progress on this browser?")) {
      setProgress(initialProgress);
      setNotice("Progress reset. A fresh start!");
      setTimeout(() => setNotice(""), 2600);
    }
  };

  const current = quiz?.questions[quiz.index];
  const selectedAnswer = current ? quiz.answers[current.id] : undefined;
  const correctCount = quiz
    ? quiz.questions.filter((q) => quiz.answers[q.id] === q.answer).length
    : 0;
  const answeredInQuiz = quiz ? Object.keys(quiz.answers).length : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setPage("dashboard")}
          aria-label="CloudPrep home"
        >
          <span className="brand-mark">☁</span>
          <span>
            cloudprep<span className="brand-ai">.ai</span>
            <small>AZ-900 STUDY COACH</small>
          </span>
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list">
          <button
            className={page === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("dashboard")}
          >
            <span>▦</span> Dashboard
          </button>
          <button
            className={page === "quiz" ? "nav-item active" : "nav-item"}
            onClick={() => startQuiz(selectedTopic)}
          >
            <span>✳</span> Practice quiz
          </button>
          <button
            className={page === "coach" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("coach")}
          >
            <span>✧</span> AI study coach <span className="nav-new">AI</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card">
            <span className="streak-icon">✦</span>
            <div>
              <strong>Small steps add up</strong>
              <p>10 minutes of practice today can make a difference.</p>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">E</div>
            <div className="profile-copy">
              <strong>AZ-900 learner</strong>
              <span>Building cloud confidence</span>
            </div>
            <span className="profile-dot" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {page === "dashboard"
                ? "Dashboard"
                : page === "quiz"
                  ? "Practice quiz"
                  : "AI study coach"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="unofficial-pill">
              <span /> Unofficial learning tool
            </span>
            <div className="top-avatar">E</div>
          </div>
        </header>
        {notice && <div className="toast">✓ {notice}</div>}

        {page === "dashboard" && (
          <section className="page dashboard-page">
            <div className="welcome-row">
              <div>
                <div className="eyebrow">
                  <span className="sparkle">✦</span> YOUR CLOUD JOURNEY STARTS
                  HERE
                </div>
                <h1>
                  Let’s make cloud <span>click.</span>
                </h1>
                <p className="page-subtitle">
                  Practise a little. Understand a lot. Build your AZ-900
                  confidence.
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => startQuiz("all")}
              >
                Start a quick quiz <span>→</span>
              </button>
            </div>
            <div className="hero-card">
              <div className="hero-copy">
                <span className="hero-tag">
                  <span className="pulse" /> YOUR NEXT STEP
                </span>
                <h2>
                  {weakestTopic
                    ? `Let’s strengthen ${weakestTopic.short.toLowerCase()}.`
                    : "Your cloud confidence starts with one question."}
                </h2>
                <p>
                  {weakestTopic
                    ? `Your practice accuracy here is ${weakestTopic.accuracy}%. Review the explanations, then take another short quiz.`
                    : "Start with five original practice questions and get a clear explanation after every answer."}
                </p>
                <button
                  className="button button-light"
                  onClick={() => startQuiz(weakestTopic?.id || "all")}
                >
                  {weakestTopic
                    ? "Practise this topic"
                    : "Take your first quiz"}{" "}
                  <span>↗</span>
                </button>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="cloud-illustration">
                  <span className="cloud-shape">☁</span>
                  <span className="cloud-spark spark-a">✦</span>
                  <span className="cloud-spark spark-b">✧</span>
                  <span className="cloud-spark spark-c">·</span>
                </div>
                <div className="float-chip chip-top">☁ Cloud concepts</div>
                <div className="float-chip chip-bottom">✓ Learn by doing</div>
              </div>
            </div>
            <div className="section-heading">
              <div>
                <h2>Your progress</h2>
                <p>Every attempt helps you learn what to focus on.</p>
              </div>
              <button className="text-button" onClick={resetProgress}>
                Reset progress
              </button>
            </div>
            <div className="stats-grid">
              <StatCard
                label="Questions answered"
                value={totalAnswered}
                detail="Across all topics"
                icon="↗"
                tone="blue"
              />
              <StatCard
                label="Practice accuracy"
                value={`${overallAccuracy}%`}
                detail={
                  totalAnswered
                    ? "Correct answers so far"
                    : "Your starting point"
                }
                icon="◎"
                tone="purple"
              />
              <StatCard
                label="Quiz sessions"
                value={progress.sessions}
                detail="Completed sessions"
                icon="▤"
                tone="orange"
              />
              <StatCard
                label="Topics explored"
                value={topicStats.filter((t) => t.attempted > 0).length}
                detail="Out of 3 exam areas"
                icon="✧"
                tone="green"
              />
            </div>
            <div className="lower-grid">
              <div className="panel topics-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Explore exam topics</h2>
                    <p>Choose an area to practise.</p>
                  </div>
                  <span className="mini-count">3 TOPICS</span>
                </div>
                <div className="topic-list">
                  {TOPICS.map((topic) => {
                    const stats = topicStats.find((t) => t.id === topic.id);
                    return (
                      <div className="topic-row" key={topic.id}>
                        <div className={`topic-icon ${topic.color}`}>
                          {topic.icon}
                        </div>
                        <div className="topic-main">
                          <strong>{topic.title}</strong>
                          <span>{topic.description}</span>
                          <div className="progress-track">
                            <div
                              className={`progress-fill ${topic.color}`}
                              style={{ width: `${stats.accuracy}%` }}
                            />
                          </div>
                        </div>
                        <div className="topic-score">
                          <strong>
                            {stats.attempted ? `${stats.accuracy}%` : "—"}
                          </strong>
                          <span>
                            {stats.attempted
                              ? `${stats.attempted} answered`
                              : "Not started"}
                          </span>
                        </div>
                        <button
                          className="round-arrow"
                          onClick={() => startQuiz(topic.id)}
                          aria-label={`Practice ${topic.title}`}
                        >
                          →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="panel coach-panel">
                <div className="coach-heading">
                  <div className="coach-orb">✧</div>
                  <div>
                    <h2>Meet your study coach</h2>
                    <p>A concept not clicking? Let’s break it down.</p>
                  </div>
                </div>
                <div className="coach-sample">
                  <div className="coach-sample-icon">✦</div>
                  <p>
                    “Think of <strong>CapEx vs OpEx</strong> like buying a
                    computer for your cybercafé versus paying monthly for a
                    cloud service.”
                  </p>
                </div>
                <div className="coach-prompt-label">TRY ASKING</div>
                <div className="suggestions">
                  <button
                    onClick={() => {
                      setCoachInput(
                        "Explain CapEx vs OpEx with a Kenyan business example",
                      );
                      setPage("coach");
                    }}
                  >
                    CapEx vs OpEx <span>↗</span>
                  </button>
                  <button
                    onClick={() => {
                      setCoachInput(
                        "What is the difference between Azure Policy and resource locks?",
                      );
                      setPage("coach");
                    }}
                  >
                    Policy vs resource locks <span>↗</span>
                  </button>
                </div>
                <button
                  className="button button-primary full-button"
                  onClick={() => setPage("coach")}
                >
                  Chat with your coach <span>→</span>
                </button>
              </div>
            </div>
            <footer className="footer-note">
              <span>✦</span> Made for learners, by learners. Keep showing up.
            </footer>
          </section>
        )}

        {page === "quiz" && (
          <section className="page quiz-page">
            {!quiz && (
              <div className="panel start-quiz-panel">
                <div className="eyebrow">PRACTICE MODE</div>
                <h1>Choose your focus.</h1>
                <p className="page-subtitle">
                  Pick a topic and work through five original practice
                  questions.
                </p>
                <div className="topic-picker">
                  <button
                    className={
                      selectedTopic === "all"
                        ? "topic-pick selected"
                        : "topic-pick"
                    }
                    onClick={() => setSelectedTopic("all")}
                  >
                    <span>✳</span>
                    <strong>All topics</strong>
                    <small>Mixed practice</small>
                  </button>
                  {TOPICS.map((t) => (
                    <button
                      key={t.id}
                      className={
                        selectedTopic === t.id
                          ? "topic-pick selected"
                          : "topic-pick"
                      }
                      onClick={() => setSelectedTopic(t.id)}
                    >
                      <span>{t.icon}</span>
                      <strong>{t.short}</strong>
                      <small>{t.description}</small>
                    </button>
                  ))}
                </div>
                <button
                  className="button button-primary"
                  onClick={() => startQuiz(selectedTopic)}
                >
                  Start quiz <span>→</span>
                </button>
              </div>
            )}
            {quiz && !quiz.finished && current && (
              <div className="quiz-layout">
                <div className="quiz-main">
                  <button
                    className="back-link"
                    onClick={() => {
                      setQuiz(null);
                      setPage("dashboard");
                    }}
                  >
                    ← Back to dashboard
                  </button>
                  <div className="quiz-progress-head">
                    <div>
                      <span className="eyebrow">
                        {topicFor(current.topic).short.toUpperCase()}
                      </span>
                      <h1>Let’s check your understanding.</h1>
                    </div>
                    <span className="question-counter">
                      QUESTION <strong>{quiz.index + 1}</strong> /{" "}
                      {quiz.questions.length}
                    </span>
                  </div>
                  <div className="quiz-progress">
                    <div
                      style={{
                        width: `${((quiz.index + 1) / quiz.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="question-card">
                    <div className="question-meta">
                      <span className="question-number">
                        Q{String(quiz.index + 1).padStart(2, "0")}
                      </span>
                      <span className="difficulty">{current.difficulty}</span>
                      <span className="question-type">Single answer</span>
                    </div>
                    <h2>{current.question}</h2>
                    <div className="answer-options">
                      {current.options.map((option, index) => {
                        let cls = "answer-option";
                        if (
                          selectedAnswer !== undefined &&
                          index === current.answer
                        )
                          cls += " correct";
                        else if (
                          selectedAnswer === index &&
                          index !== current.answer
                        )
                          cls += " incorrect";
                        return (
                          <button
                            key={option}
                            className={cls}
                            onClick={() => chooseAnswer(index)}
                            disabled={selectedAnswer !== undefined}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                            {selectedAnswer !== undefined &&
                              index === current.answer && (
                                <span className="option-result">✓</span>
                              )}
                            {selectedAnswer === index &&
                              index !== current.answer && (
                                <span className="option-result">×</span>
                              )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswer !== undefined && (
                      <div
                        className={
                          selectedAnswer === current.answer
                            ? "feedback-box right"
                            : "feedback-box wrong"
                        }
                      >
                        <div className="feedback-title">
                          {selectedAnswer === current.answer
                            ? "✓ That’s right!"
                            : "↗ Not quite — here’s why"}
                        </div>
                        <p>{current.explanation}</p>
                        <div className="why-list">
                          <strong>Let’s review each option</strong>
                          {current.whyWrong.map((why, i) => (
                            <div
                              key={why}
                              className={
                                i === current.answer
                                  ? "why-item right-answer"
                                  : "why-item"
                              }
                            >
                              <span>{String.fromCharCode(65 + i)}</span>
                              <p>{why}</p>
                            </div>
                          ))}
                        </div>
                        <button
                          className="coach-inline"
                          onClick={() => {
                            setCoachInput(
                              `Explain this AZ-900 practice question in simpler terms: ${current.question} My selected answer was ${current.options[selectedAnswer]}. The correct answer is ${current.options[current.answer]}.`,
                            );
                            setPage("coach");
                          }}
                        >
                          Still confused? Ask the AI coach <span>→</span>
                        </button>
                      </div>
                    )}
                    <div className="quiz-actions">
                      <span className="answered-note">
                        {answeredInQuiz} of {quiz.questions.length} answered
                      </span>
                      {quiz.index < quiz.questions.length - 1 ? (
                        <button
                          className="button button-primary"
                          disabled={selectedAnswer === undefined}
                          onClick={() =>
                            setQuiz((old) => ({ ...old, index: old.index + 1 }))
                          }
                        >
                          Next question <span>→</span>
                        </button>
                      ) : (
                        <button
                          className="button button-primary"
                          disabled={selectedAnswer === undefined}
                          onClick={finishQuiz}
                        >
                          See my results <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <aside className="quiz-side">
                  <div className="panel quiz-side-panel">
                    <div className="side-illustration">☁</div>
                    <h3>Understand, don’t memorise.</h3>
                    <p>
                      Every question is original practice content designed
                      around the public AZ-900 skills outline.
                    </p>
                    <div className="side-divider" />
                    <div className="side-stat">
                      <span>✓</span>
                      <div>
                        <strong>Instant feedback</strong>
                        <small>See why each answer works.</small>
                      </div>
                    </div>
                    <div className="side-stat">
                      <span>✧</span>
                      <div>
                        <strong>Learn from mistakes</strong>
                        <small>Review every option.</small>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
            {quiz?.finished && (
              <div className="results-wrap">
                <div className="results-card">
                  <div className="result-medal">✦</div>
                  <div className="eyebrow">QUIZ COMPLETE</div>
                  <h1>
                    {quiz.score >= 4
                      ? "Look at you go!"
                      : "Every mistake is a clue."}
                  </h1>
                  <p className="page-subtitle">
                    You’ve taken another step toward understanding Azure.
                  </p>
                  <div className="result-score">
                    <strong>
                      {Math.round((quiz.score / quiz.questions.length) * 100)}
                      <small>%</small>
                    </strong>
                    <span>
                      {quiz.score} out of {quiz.questions.length} correct
                    </span>
                  </div>
                  <div className="result-track">
                    <div
                      style={{
                        width: `${(quiz.score / quiz.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="result-summary">
                    <div>
                      <strong>{quiz.questions.length}</strong>
                      <span>Questions</span>
                    </div>
                    <div>
                      <strong>{quiz.questions.length - quiz.score}</strong>
                      <span>To review</span>
                    </div>
                    <div>
                      <strong>{topicFor(quiz.questions[0].topic).short}</strong>
                      <span>First topic</span>
                    </div>
                  </div>
                  <div className="result-actions">
                    <button
                      className="button button-primary"
                      onClick={() => startQuiz(selectedTopic)}
                    >
                      Try another quiz <span>→</span>
                    </button>
                    <button
                      className="button button-outline"
                      onClick={() => {
                        setCoachInput(
                          "Help me review the concepts I got wrong in my last practice quiz.",
                        );
                        setPage("coach");
                      }}
                    >
                      Review with coach
                    </button>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => {
                      setQuiz(null);
                      setPage("dashboard");
                    }}
                  >
                    Back to dashboard
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {page === "coach" && (
          <section className="page coach-page">
            <div className="coach-page-header">
              <div>
                <div className="eyebrow">
                  <span className="sparkle">✧</span> YOUR PERSONAL CLOUD TUTOR
                </div>
                <h1>
                  Let’s make it <span>make sense.</span>
                </h1>
                <p className="page-subtitle">
                  No judgement, no jargon overload. Ask away.
                </p>
              </div>
              <span className={`mode-pill ${coachMode === "ai" ? "live" : ""}`}>
                <span /> {coachMode === "ai" ? "AI connected" : "Demo coach"}
              </span>
            </div>
            <div className="chat-layout">
              <div className="chat-panel">
                <div className="chat-top">
                  <div className="coach-orb">✧</div>
                  <div>
                    <strong>CloudPrep coach</strong>
                    <span>
                      <i />{" "}
                      {coachMode === "ai"
                        ? "AI-powered explanations"
                        : "Learning demo · ready to help"}
                    </span>
                  </div>
                  <button
                    className="chat-clear"
                    onClick={() =>
                      setCoachMessages([
                        {
                          role: "assistant",
                          content:
                            "Fresh start! What Azure concept shall we unpack?",
                        },
                      ])
                    }
                  >
                    New chat ↻
                  </button>
                </div>
                <div className="chat-messages">
                  {coachMessages.map((m, i) => (
                    <div key={i} className={`message-row ${m.role}`}>
                      <div
                        className={
                          m.role === "assistant"
                            ? "message-avatar bot-avatar"
                            : "message-avatar user-avatar"
                        }
                      >
                        {m.role === "assistant" ? "✧" : "E"}
                      </div>
                      <div className="message-bubble">
                        <div className="message-author">
                          {m.role === "assistant" ? "CLOUDREADY COACH" : "YOU"}
                        </div>
                        <p>{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {coachLoading && (
                    <div className="message-row assistant">
                      <div className="message-avatar bot-avatar">✧</div>
                      <div className="message-bubble">
                        <div className="message-author">CLOUDREADY COACH</div>
                        <p className="typing">
                          Thinking through that<span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <form className="chat-composer" onSubmit={askCoach}>
                  <textarea
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    placeholder="Ask about Azure, cloud concepts, or a question you missed…"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        askCoach(e);
                      }
                    }}
                  />
                  <div className="composer-bottom">
                    <span>↵ Enter to send · Shift + Enter for a new line</span>
                    <button
                      className="send-button"
                      type="submit"
                      disabled={!coachInput.trim() || coachLoading}
                    >
                      Send <span>↑</span>
                    </button>
                  </div>
                </form>
              </div>
              <aside className="coach-tools">
                <div className="panel prompt-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Try a prompt</h2>
                      <p>Choose a starting point.</p>
                    </div>
                  </div>
                  {[
                    "Explain IaaS, PaaS and SaaS with an everyday example.",
                    "What is the difference between Azure Policy and resource locks?",
                    "Explain CapEx vs OpEx like I’m new to cloud computing.",
                    "What is the difference between regions and availability zones?",
                  ].map((p, i) => (
                    <button
                      className="prompt-item"
                      key={p}
                      onClick={() => setCoachInput(p)}
                    >
                      <span>{["◈", "🛡", "◉", "⌖"][i]}</span>
                      <p>{p}</p>
                      <b>↗</b>
                    </button>
                  ))}
                </div>
                <div className="coach-disclaimer">
                  <span>ⓘ</span>
                  <p>
                    <strong>Learning first.</strong> This is an unofficial study
                    aid. Always verify key details against the public Microsoft
                    Learn AZ-900 skills outline.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
