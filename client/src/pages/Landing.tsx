import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { LawyerCard } from "@/components/LawyerCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CountrySelector } from "@/components/CountrySelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  MessageSquare,
  Users,
  Shield,
  Scale,
  FileText,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import lawyerImage1 from "@assets/generated_images/Lawyer_profile_photo_1_dbd3315b.png";
import lawyerImage2 from "@assets/generated_images/Lawyer_profile_photo_2_ff61062b.png";
import lawyerImage3 from "@assets/generated_images/Lawyer_profile_photo_3_6b401497.png";

//todo: remove mock functionality
const mockLawyers = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: lawyerImage1,
    specialization: "Corporate Law",
    location: "Mumbai, India",
    rating: 4.8,
    reviewCount: 156,
    experience: 12,
    hearings: 450,
    eloRating: 1842,
    isOnline: true,
    status: "available" as const,
    whatsapp: "919876543210",
  },
  {
    id: "2",
    name: "Robert Mitchell",
    avatar: lawyerImage2,
    specialization: "Criminal Defense",
    location: "New York, USA",
    rating: 4.9,
    reviewCount: 203,
    experience: 15,
    hearings: 680,
    eloRating: 1956,
    isOnline: true,
    status: "busy" as const,
    whatsapp: "12125551234",
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    avatar: lawyerImage3,
    specialization: "Family Law",
    location: "London, UK",
    rating: 4.7,
    reviewCount: 128,
    experience: 10,
    hearings: 385,
    eloRating: 1798,
    isOnline: true,
    status: "available" as const,
    whatsapp: "447911123456",
  },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [country, setCountry] = useState("IN");
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">LegalEase</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#lawyers" className="text-sm font-medium hover:text-primary transition-colors">
              Find Lawyers
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <CountrySelector value={country} onValueChange={setCountry} />
            <LanguageSelector value={language} onValueChange={setLanguage} />
            <ThemeToggle />
            <Button asChild data-testid="button-sign-in">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Hero />

        <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden" id="features">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-chart-2/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-20 animate-slide-in-bottom">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-sm font-medium text-primary">Comprehensive Features</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Everything You Need for{" "}
                <span className="text-gradient">Legal Assistance</span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive legal support at your fingertips, powered by AI
                and verified professionals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="stagger-item">
                <FeatureCard
                  icon={MessageSquare}
                  title="AI Legal Chatbot"
                  description="Get instant answers to legal questions with Gemini-powered AI that understands country-specific laws and provides citations."
                />
              </div>
              <div className="stagger-item">
                <FeatureCard
                  icon={Users}
                  title="Lawyer Marketplace"
                  description="Browse verified lawyers by specialization, location, and ELO rating. Book video consultations with top-rated professionals."
                />
              </div>
              <div className="stagger-item">
                <FeatureCard
                  icon={Shield}
                  title="Encrypted Document Vault"
                  description="Store legal documents with AES-256 client-side encryption. Only you hold the keys—true zero-knowledge security."
                />
              </div>
              <div className="stagger-item">
                <FeatureCard
                  icon={Globe}
                  title="Multi-Country Support"
                  description="Access legal information for India, US, UK, and more. AI adapts to your jurisdiction automatically."
                />
              </div>
              <div className="stagger-item">
                <FeatureCard
                  icon={FileText}
                  title="Document Analysis"
                  description="Upload contracts and legal documents for AI-powered summarization and clause explanation in plain language."
                />
              </div>
              <div className="stagger-item">
                <FeatureCard
                  icon={CheckCircle}
                  title="Verified Reviews"
                  description="Read authentic client reviews and case outcome statistics. Make informed decisions with transparent lawyer profiles."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="lawyers">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Featured Legal Professionals
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with top-rated lawyers across specializations and
                locations.
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {mockLawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer.id}
                  {...lawyer}
                  onBook={() => console.log("Booking", lawyer.name)}
                  onClick={() => console.log("View profile", lawyer.name)}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild data-testid="button-view-all-lawyers">
                <a href="/api/login">
                  View All Lawyers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-primary via-primary to-chart-2 text-primary-foreground relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
            <div className="animate-slide-in-bottom">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to Get Started?
              </h2>
              <p className="text-xl lg:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands who are getting instant legal help in their language.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 group"
                asChild
                data-testid="button-start-chat-cta"
              >
                <a href="/api/login">
                  <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Free Chat
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6 backdrop-blur-sm shadow-lg group"
                asChild
                data-testid="button-find-lawyer-cta"
              >
                <a href="/api/login">
                  Find a Lawyer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Scale className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">LegalEase</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered legal assistance for everyone, everywhere.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    AI Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Find Lawyers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Document Vault
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 LegalEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
