import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const GAME_DURATION = 60; // in seconds
const TILT_THRESHOLD = 15; // degrees

export const loader = async () => {
  const words = [
    "قطة", "كلب", "أسد", "فيل", "زرافة",
    "نمر", "دب", "ثعلب", "غزال", "فرس النهر",
    "تفاحة", "موز", "برتقال", "عنب", "فراولة",
    "بطيخ", "خوخ", "مشمش", "كمثرى", "مانجو",
    "طبيب", "مهندس", "معلم", "طيار", "شرطي",
    "محامي", "صحفي", "مصور", "طباخ", "نجار",
    "القاهرة", "دبي", "الرياض", "بيروت", "عمان",
    "بغداد", "دمشق", "الدوحة", "أبوظبي", "مسقط",
    "كرة القدم", "كرة السلة", "التنس", "السباحة", "الجري",
    "الملاكمة", "كرة الطائرة", "الجولف", "كرة اليد", "الجمباز"
  ];
  return json({ words });
};

export default function Game() {
  const { words } = useLoaderData<typeof loader>();
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [orientation, setOrientation] = useState({ beta: 0, gamma: 0 });
  const [lastAction, setLastAction] = useState<'correct' | 'pass' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      navigate("/results", { state: { score } });
    }
  }, [timeLeft, gameStarted, navigate, score]);

  useEffect(() => {
    if (gameStarted) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        setOrientation({
          beta: event.beta || 0,
          gamma: event.gamma || 0,
        });
      };

      window.addEventListener('deviceorientation', handleOrientation);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      if (orientation.gamma > TILT_THRESHOLD && lastAction !== 'correct') {
        handleCorrect();
        setLastAction('correct');
      } else if (orientation.gamma < -TILT_THRESHOLD && lastAction !== 'pass') {
        handlePass();
        setLastAction('pass');
      } else if (Math.abs(orientation.gamma) < 5) {
        setLastAction(null);
      }
    }
  }, [orientation, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    nextWord();
  };

  const nextWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
  };

  const handleCorrect = () => {
    setScore(score + 1);
    nextWord();
  };

  const handlePass = () => {
    nextWord();
  };

  if (!gameStarted) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4" dir="rtl">
        <h2 className="mb-4 text-2xl font-bold text-white text-center">هل أنت مستعد للعب؟</h2>
        <p className="mb-4 text-white text-center">قم بإمالة جهازك لليمين للإجابة الصحيحة، ولليسار للتخطي.</p>
        <button
          onClick={startGame}
          className="rounded bg-white px-4 py-2 font-semibold text-blue-600 shadow transition hover:bg-blue-100"
        >
          ابدأ اللعبة
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4" dir="rtl">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-white">{currentWord}</h2>
        <p className="mt-2 text-xl text-white">الوقت المتبقي: {timeLeft} ثانية</p>
        <p className="mt-2 text-xl text-white">النتيجة: {score}</p>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <button
          onClick={handleCorrect}
          className="rounded bg-green-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-green-600"
        >
          صحيح
        </button>
        <button
          onClick={handlePass}
          className="rounded bg-red-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-red-600 sm:mr-4 sm:ml-0"
        >
          تخطي
        </button>
      </div>
      <p className="mt-4 text-white text-center">
        قم بإمالة الجهاز لليمين للإجابة الصحيحة، ولليسار للتخطي
      </p>
    </div>
  );
}