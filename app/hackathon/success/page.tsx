"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Home, Mail, User, Hash } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SuccessPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedData = sessionStorage.getItem("registrationSuccess");
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // If no data, redirect to home
      router.push("/");
    }

    // Optional: Clear session storage after reading
    // sessionStorage.removeItem("registrationSuccess");
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Toaster position="top-center" />
      <main className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 lg:px-8">
        <div className="hero-orb hero-orb-green opacity-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white sm:text-5xl">Registration Successful!</h1>
          <p className="mt-4 text-lg text-zinc-400">
            Congratulations! Your team has been registered for Xavathon. Please note down your Team ID for future reference.
          </p>

          <div className="mt-12 panel p-8 space-y-6 text-left">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DetailItem
                icon={<Hash className="h-5 w-5 text-orange-400" />}
                label="Team ID"
                value={data.teamId}
                canCopy
                onCopy={() => copyToClipboard(data.teamId)}
              />
              <DetailItem
                icon={<User className="h-5 w-5 text-orange-400" />}
                label="Team Name"
                value={data.teamName}
              />
              <DetailItem
                icon={<User className="h-5 w-5 text-orange-400" />}
                label="Team Leader"
                value={data.leaderName}
              />
              <DetailItem
                icon={<Mail className="h-5 w-5 text-orange-400" />}
                label="Registered Email"
                value={data.leaderEmail}
              />
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-sm text-zinc-500 text-center italic">
                A confirmation email has been sent to the leader&apos;s email address. Our team will review your application and get back to you soon.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full border border-orange-300/70 bg-linear-to-r from-orange-500 to-amber-400 px-8 py-3 text-sm font-bold text-black shadow-[0_10px_30px_rgba(249,115,22,0.4)]"
            >
              Download Receipt
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function DetailItem({ icon, label, value, canCopy, onCopy }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="flex items-center justify-between gap-3 group">
        <span className="text-lg font-medium text-white break-all">{value}</span>
        {canCopy && (
          <button
            onClick={onCopy}
            className="p-2 rounded-lg bg-white/5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
