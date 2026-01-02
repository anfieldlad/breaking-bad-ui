'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/Button';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 px-4 md:px-6 py-4 transition-all duration-300 ${isMenuOpen ? 'bg-bad-black' : 'glass'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl md:text-2xl font-black tracking-tighter">
                        <span className="bg-bad-green text-bad-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(77,161,99,0.5)]">Br</span>
                        <span className="text-foreground ml-0.5">eaking</span>
                        <span className="bg-bad-green text-bad-black px-1.5 py-0.5 rounded ml-1.5 shadow-[0_0_10px_rgba(77,161,99,0.5)]">B.A.D.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
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

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-0.5 bg-bad-green transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-bad-green mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-bad-green mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col space-y-1 pt-3 pb-4 border-t border-bad-green/30">
                    <Link
                        href="/ingest"
                        className="text-base font-semibold text-white hover:text-bad-green transition-colors py-3 px-3 rounded-lg hover:bg-bad-green/10 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="w-2 h-2 bg-bad-green rounded-full mr-3"></span>
                        Ingestion
                    </Link>
                    <Link
                        href="/chat"
                        className="text-base font-semibold text-white hover:text-bad-green transition-colors py-3 px-3 rounded-lg hover:bg-bad-green/10 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="w-2 h-2 bg-bad-green rounded-full mr-3"></span>
                        Laboratory
                    </Link>
                    <div className="pt-3 px-3">
                        <Button variant="outline" size="sm" className="w-full">
                            Connect
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
