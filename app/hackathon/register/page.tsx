import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RegistrationForm } from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Hackathon Registration | Xavathon",
  description: "Register your team for Xavathon - the premium college hackathon.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="relative overflow-hidden px-6 pt-24 pb-20 lg:px-8">
        {/* Background Orbs */}
        <div className="hero-orb hero-orb-blue opacity-5" />
        <div className="hero-orb hero-orb-orange opacity-10" style={{ right: '5%', top: '20%' }} />

        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Registration Form
            </h1>
            <p className="mt-4 text-base text-zinc-400">
              Fill in the details below to secure your spot in Xavathon.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
