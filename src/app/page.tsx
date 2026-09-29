export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        {/* 프로필 아바타 */}
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-2xl font-bold text-white shadow-sm">
          CY
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          임채윤
        </h1>

        {/* 소개글 */}
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>
      </div>
    </main>
  );
}
