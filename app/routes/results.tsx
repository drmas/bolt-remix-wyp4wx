import { useLocation, Link } from "@remix-run/react";

export default function Results() {
  const location = useLocation();
  const score = location.state?.score || 0;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4" dir="rtl">
      <h2 className="mb-4 text-3xl font-bold text-white">انتهت اللعبة!</h2>
      <p className="mb-8 text-2xl text-white">نتيجتك: {score}</p>
      <Link
        to="/game"
        className="rounded bg-white px-4 py-2 font-semibold text-blue-600 shadow transition hover:bg-blue-100"
      >
        العب مرة أخرى
      </Link>
    </div>
  );
}