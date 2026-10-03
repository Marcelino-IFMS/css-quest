import SelectorChallenge from "@/components/SelectorChallenge/SelectorChallenge";

export default function SelecaoPage({ params }: { params: { fase: string } }) {
  const order = Number(params.fase);

  return (
    <main className="min-h-screen bg-[#f5f4ee] px-6 py-10">
      <SelectorChallenge order={order} />
    </main>
  );
}
