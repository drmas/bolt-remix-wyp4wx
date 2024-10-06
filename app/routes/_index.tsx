import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4" dir="rtl">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-white">خمن الكلمة</h1>
        <p className="mb-8 text-white">قم بإمالة جهازك للعب!</p>
        <Link
          to="/game"
          className="rounded bg-white px-4 py-2 font-semibold text-blue-600 shadow transition hover:bg-blue-100"
        >
          ابدأ اللعبة
        </Link>
      </div>
    </div>
  );
}