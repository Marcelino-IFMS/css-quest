import Challenge from "@/components/Challenge/Challenge";

export default function LessonPage({ params }: { params: { lesson: string } }) {
  const order = Number(params.lesson);

  return (
    <main className="min-h-screen bg-[#f5f4ee] px-6 py-10">
      <Challenge order={order} />
    </main>
  );
}
