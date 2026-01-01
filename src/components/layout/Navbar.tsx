import Link from 'next/link';
import { Button } from '../ui/Button';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-black tracking-tighter">
                        <span className="bg-bad-green text-bad-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(77,161,99,0.5)]">Br</span>
                        <span className="text-foreground ml-0.5">eaking</span>
                        <span className="bg-bad-green text-bad-black px-1.5 py-0.5 rounded ml-1.5 shadow-[0_0_10px_rgba(77,161,99,0.5)]">B.A.D.</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-6">
                    <Link href="/ingest" className="text-sm font-medium text-foreground/70 hover:text-bad-green transition-colors">
                        Ingestion
                    </Link>
                    <Link href="/chat" className="text-sm font-medium text-foreground/70 hover:text-bad-green transition-colors">
                        Laboratory
                    </Link>
                    <Button variant="outline" size="sm">
                        Connect
                    </Button>
                </div>
            </div>
        </nav>
    );
};
