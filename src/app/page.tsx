import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-16 sm:mb-24">
        <div className="inline-flex items-center space-x-2 glass-green px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 animate-pulse">
          <span className="w-2 h-2 bg-bad-green rounded-full shadow-[0_0_8px_#4da163]" />
          <span className="text-[10px] sm:text-xs font-bold text-bad-green uppercase tracking-widest">Laboratory Status: Online</span>
        </div>

        <div className="flex flex-col items-center mb-6 w-full">
          <span className="text-bad-green text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2">Breaking B.A.D.</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none">
            THE PUREST <br />
            <span className="text-bad-green text-glow-green italic">INTELLIGENCE</span>
          </h1>
        </div>

        <p className="max-w-2xl text-base sm:text-xl text-foreground/60 mb-2 px-2">
          &quot;Breaking down files. Building up answers.&quot;
        </p>
        <p className="max-w-2xl text-[10px] sm:text-xs text-bad-green/40 mb-8 sm:mb-12 uppercase tracking-widest font-bold px-2">
          Bot Answering Dialogue • RAG Chatbot APP
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
          <Link href="/chat" className="w-full sm:w-[220px]">
            <Button size="lg" className="w-full">Enter Laboratory</Button>
          </Link>
          <Link href="/ingest" className="w-full sm:w-[220px]">
            <Button variant="outline" size="lg" className="w-full">Access Ingestion</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-16 sm:mb-24">
        <Card title="Cook the Data" variant="green">
          <p className="text-foreground/70 text-sm sm:text-base">
            Advanced ingestion engine that breaks down complex PDFs into digestible chemical chunks.
          </p>
        </Card>
        <Card title="Blue Crystal SSE" variant="blue">
          <p className="text-foreground/70 text-sm sm:text-base">
            Real-time streaming responses with 99% purity. Watch the reasoning &quot;cook&quot; before your eyes.
          </p>
        </Card>
        <Card title="The Empire Business" variant="default">
          <p className="text-foreground/70 text-sm sm:text-base">
            Scalable architecture designed for high-performance chemical data orchestration.
          </p>
        </Card>
      </section>

      {/* Visual Element */}
      <div className="relative h-[250px] sm:h-[400px] w-full glass rounded-2xl sm:rounded-[3rem] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="z-10 text-center px-4">
          <div className="text-bad-blue text-5xl sm:text-9xl font-black opacity-10 blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            METH-AI
          </div>
          <div className="relative">
            <h2 className="text-xl sm:text-4xl font-bold mb-2 sm:mb-4 tracking-tight">Stay Out of My Territory</h2>
            <p className="text-foreground/50 text-sm sm:text-base">Only the highest quality intelligence is allowed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
