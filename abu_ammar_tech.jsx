import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Course Catalog
const COURSE_CATALOG = [
  {
    id: "data-analysis",
    title: "Data Analysis",
    description: "Learn how to analyze data effectively using modern tools.",
    lessons: [
      { title: "Introduction to Data Analysis", content: "Lesson content here..." },
      { title: "Using Excel & Python", content: "Lesson content here..." },
    ],
    quiz: {
      questions: [
        { q: "Which tool is commonly used for data analysis?", options: ["MS Word", "Excel", "Photoshop"], answer: 1 },
      ],
      passMark: 70,
    },
  },
  {
    id: "data-entry",
    title: "Data Entry",
    description: "Master accurate and efficient data entry skills.",
    lessons: [
      { title: "Typing & Accuracy", content: "Lesson content here..." },
      { title: "Database Input", content: "Lesson content here..." },
    ],
    quiz: {
      questions: [
        { q: "What is the most important skill in data entry?", options: ["Speed", "Accuracy", "Guessing"], answer: 1 },
      ],
      passMark: 70,
    },
  },
  {
    id: "it-basics",
    title: "IT Basics",
    description: "Fundamentals of information technology for beginners.",
    lessons: [
      { title: "Hardware vs Software", content: "Lesson content here..." },
      { title: "Networking Basics", content: "Lesson content here..." },
    ],
    quiz: {
      questions: [
        { q: "Which of these is hardware?", options: ["MS Excel", "Keyboard", "Linux"], answer: 1 },
      ],
      passMark: 70,
    },
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Learn how to fix common IT problems.",
    lessons: [
      { title: "Diagnosing Issues", content: "Lesson content here..." },
      { title: "Basic Fixes", content: "Lesson content here..." },
    ],
    quiz: {
      questions: [
        { q: "What’s the first step in troubleshooting?", options: ["Restart device", "Replace hardware", "Panic"], answer: 0 },
      ],
      passMark: 70,
    },
  },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCourse, setActiveCourse] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [certificateName, setCertificateName] = useState("");

  const startCourse = (course) => {
    setActiveCourse(course);
    setPage("course");
  };

  const takeQuiz = () => setPage("quiz");
  const viewCertificate = () => setPage("certificate");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 text-xl font-bold shadow-md">
        AbuAmmar Tech Academy
      </header>

      <main className="p-6">
        {page === "home" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-semibold mb-4">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COURSE_CATALOG.map((course) => (
                <Card
                  key={course.id}
                  className="cursor-pointer hover:shadow-lg"
                  onClick={() => startCourse(course)}
                >
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold">{course.title}</h2>
                    <p className="text-gray-600">{course.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {page === "course" && activeCourse && (
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-2xl font-semibold mb-4">{activeCourse.title}</h1>
            <ul className="list-disc pl-6 mb-4">
              {activeCourse.lessons.map((lesson, idx) => (
                <li key={idx} className="mb-2">
                  <strong>{lesson.title}</strong>: {lesson.content}
                </li>
              ))}
            </ul>
            <Button onClick={takeQuiz}>Take Quiz</Button>
          </motion.div>
        )}

        {page === "quiz" && activeCourse && (
          <Quiz
            course={activeCourse}
            onComplete={(score) => {
              setQuizScore(score);
              setPage("certificate");
            }}
          />
        )}

        {page === "certificate" && quizScore !== null && (
          <Certificate
            course={activeCourse}
            score={quizScore}
            name={certificateName}
            setName={setCertificateName}
            goHome={() => setPage("home")}
          />
        )}
      </main>
    </div>
  );
}

function Quiz({ course, onComplete }) {
  const [answers, setAnswers] = useState(Array(course.quiz.questions.length).fill(null));

  const submitQuiz = () => {
    let correct = 0;
    course.quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    const score = Math.round((correct / course.quiz.questions.length) * 100);
    onComplete(score);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{course.title} Quiz</h2>
      {course.quiz.questions.map((q, idx) => (
        <div key={idx} className="mb-4">
          <p className="font-semibold">{q.q}</p>
          {q.options.map((opt, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={`q-${idx}`}
                value={i}
                checked={answers[idx] === i}
                onChange={() => {
                  const newAns = [...answers];
                  newAns[idx] = i;
                  setAnswers(newAns);
                }}
              /> {opt}
            </label>
          ))}
        </div>
      ))}
      <Button onClick={submitQuiz}>Submit</Button>
    </div>
  );
}

function Certificate({ course, score, name, setName, goHome }) {
  const { jsPDF } = window.jspdf;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Certificate of Completion", 60, 40);
    doc.setFontSize(14);
    doc.text(`This certifies that ${name}`, 40, 70);
    doc.text(`has successfully completed the course`, 40, 85);
    doc.text(`${course.title}`, 40, 100);
    doc.text(`with a score of ${score}%`, 40, 115);
    doc.setFontSize(12);
    doc.text("AbuAmmar Tech Academy", 40, 140);
    doc.save("certificate.pdf");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Certificate</h2>
      {score >= course.quiz.passMark ? (
        <div>
          <p>Congratulations! You passed with {score}%.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border p-2 rounded mt-2"
          />
          <Button onClick={downloadPDF} className="ml-2">Download Certificate</Button>
        </div>
      ) : (
        <p>Sorry, you scored {score}%. Please try again.</p>
      )}
      <Button onClick={goHome} className="mt-4">Back to Home</Button>
    </div>
  );
}
