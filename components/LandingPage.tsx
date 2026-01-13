import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Search, 
  Cpu, 
  ChevronDown, 
  TrendingUp, 
  Shield, 
  FileCheck,
  Hexagon
} from 'lucide-react';
import Button from './Button';
import Section from './Section';

interface LandingPageProps {
  onEnter?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Sticky Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 md:px-12 flex items-center justify-between border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-gray-200 py-3' 
            : 'bg-white border-gray-900 py-5'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-900">
             <Hexagon strokeWidth={1.5} className="w-8 h-8" />
          </div>
          <span className="font-serif italic font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
            GlassVault
          </span>
        </div>
        <nav>
          <Button 
            onClick={onEnter}
            variant="outline" 
            className={`text-sm md:text-base py-2 px-5 ${!isScrolled ? 'border-gray-900' : ''}`}
          >
            Explore Platform
          </Button>
        </nav>
      </header>

      {/* Hero Section - White */}
      <Section id="hero" className="bg-white relative pt-32 pb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-serif italic font-semibold tracking-tight text-gray-900 leading-[1.1]">
            From Reported Numbers to Verifiable Truth
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl leading-relaxed">
            GlassVault is designed to support verifiable portfolio assessment while preserving data confidentiality.
          </h2>
          <div className="pt-4">
            <Button onClick={onEnter} className="text-lg px-8 py-4">
              Explore Platform
            </Button>
          </div>
        </div>
        
        {/* Scroll Hint */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" onClick={() => scrollToSection('problem')}>
          <ChevronDown size={32} strokeWidth={1.5} />
        </div>
      </Section>

      {/* Section 2: The Problem - Very Light Gray */}
      <Section id="problem" className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
             {/* Abstract visual for problem state */}
             <div className="relative p-8 border border-gray-200 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center space-x-4 mb-6 opacity-40">
                    <FileText size={40} className="text-gray-400"/>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-center space-x-4 mb-6 opacity-40">
                    <FileText size={40} className="text-gray-400"/>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-50 text-red-800 px-4 py-2 rounded-full text-sm font-medium border border-red-100 flex items-center shadow-sm">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Verification Failed
                    </div>
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              Why trust breaks down in private credit
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Quarterly PDFs, delayed reports and confidential borrower details make it impossible to verify a fund’s real-time health. Investors wait. Trades stall. Risk premiums rise.
            </p>
            <div className="h-px w-24 bg-gray-300 my-6"></div>
            <p className="text-lg font-medium text-gray-500 italic">
              The challenge isn’t more data — it’s verifiable assurance without disclosure.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 3: The Solution - Soft Light Grey */}
      <Section id="solution" className="bg-gray-100">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              How GlassVault helps you
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              GlassVault runs inside your secure environment. A local agent ingests documents and extracts standardized loan signals. GlassVault then issues a cryptographic Proof of Valuation (PoV) that proves the portfolio’s NAV calculation and that no loan is {'>'}90 days past due — without revealing borrower identities, amounts or contracts.
            </p>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200 w-full">
            <p className="text-xl md:text-2xl text-gray-800 font-bold tracking-tight">
              Local Agentic AI + Cryptographic Attestations = Verifiable Trust
            </p>
          </div>
        </div>
      </Section>

      {/* Section 4: How It Works - Off-White (Slate-50) */}
      <Section id="how-it-works" className="bg-slate-50">
        <div className="space-y-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight text-center md:text-left">
            How it works 
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-start space-y-4 p-6 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="p-3 bg-gray-900 rounded-lg text-white">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Document Signals</h3>
              <p className="text-gray-600 leading-relaxed">
                Loan docs and receipts become standardized signals inside your environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-start space-y-4 p-6 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="p-3 bg-gray-900 rounded-lg text-white">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Local Agent</h3>
              <p className="text-gray-600 leading-relaxed">
                An on-prem AI extracts payment and covenant facts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-start space-y-4 p-6 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="p-3 bg-gray-900 rounded-lg text-white">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Validation & Proof</h3>
              <p className="text-gray-600 leading-relaxed">
                System validates claims (e.g., no loan {'>'} 90 days past due) and emits a cryptographic attestation.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-start space-y-4 p-6 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className="p-3 bg-gray-900 rounded-lg text-white">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Independent Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Investors and auditors verify the attestation — no raw loan data exchanged.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: Business Benefits - Gradient */}
      <Section id="benefits" className="bg-gradient-to-b from-slate-50 to-gray-200">
        <div className="space-y-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight text-center">
            What this enables for you
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-900 mb-2">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Faster trading</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Reduced friction and faster secondary trades.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center text-indigo-900 mb-2">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lower risk</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Early detection of hidden deterioration without data disclosure.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
              <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald-900 mb-2">
                <FileCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Audit-ready</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Portable, tamper-evident evidence for regulators and auditors.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA - Light Gray */}
      <section className="bg-gray-200 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-2xl md:text-3xl text-gray-800 font-medium">
            See portfolio assurance in action.
          </p>
          <Button onClick={onEnter} className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Explore Platform
          </Button>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-gray-200 pb-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GlassVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;