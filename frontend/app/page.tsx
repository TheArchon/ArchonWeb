'use client';

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, QrCode, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import { cancelAuth, startAuth, submitPhone, type SessionType } from "../lib/api";

type Step = 1 | 2 | 3 | 4;

const steps = ["Account", "Verify", "Security", "Session"];

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<SessionType>("pyrogram");
  const [authId, setAuthId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const demoOutput = "ARCHON-DEMO-SESSION-OUTPUT-ONLY-NOT-A-REAL-CREDENTIAL";

  useEffect(() => {
    return () => {
      if (authId) void cancelAuth(authId).catch(() => undefined);
    };
  }, [authId]);

  async function begin() {
    setError("");
    setLoading(true);
    try {
      const result = await startAuth(type);
      setAuthId(result.auth_id);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start");
    } finally {
      setLoading(false);
    }
  }

  async function continuePhone() {
    setError("");
    if (!phone.trim()) {
      setError("Enter your phone number.");
      return;
    }
    setLoading(true);
    try {
      await submitPhone(authId, phone.trim());
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to continue");
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    if (authId) await cancelAuth(authId).catch(() => undefined);
    setAuthId("");
    setPhone("");
    setError("");
    setCopied(false);
    setQr(false);
    setStep(1);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-violet-400/30 bg-violet-500/15 font-black text-violet-200 shadow-[0_0_35px_rgba(124,58,237,.2)]">A</div>
            <div>
              <div className="font-bold tracking-wide">ARCHON</div>
              <div className="text-[10px] tracking-[.3em] text-violet-300">SESSION LABS</div>
            </div>
          </div>
          {step > 1 && (
            <button onClick={reset} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">
              <XCircle size={16}/> Cancel
            </button>
          )}
        </header>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="mb-8 grid grid-cols-4 gap-2">
            {steps.map((label, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={label} className="text-center">
                  <div className={`mx-auto grid h-9 w-9 place-items-center rounded-full border text-xs transition ${
                    done ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" :
                    active ? "border-violet-400 bg-violet-600/30 text-violet-100 shadow-[0_0_30px_rgba(124,58,237,.35)]" :
                    "border-white/10 text-zinc-700"
                  }`}>{done ? <Check size={16}/> : n}</div>
                  <div className={`mt-2 text-[11px] ${active ? "text-zinc-200" : "text-zinc-600"}`}>{label}</div>
                </div>
              );
            })}
          </div>

          <section className="rounded-[28px] border border-white/10 bg-white/[.035] p-5 shadow-2xl backdrop-blur-2xl sm:p-10">
            {error && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

            {step === 1 && (
              <div>
                <div className="text-center">
                  <div className="text-3xl font-semibold tracking-tight sm:text-4xl">Create your session</div>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-500">A clean, privacy-first workflow for choosing your Telegram client format.</p>
                </div>
                <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                  {(["pyrogram", "telethon"] as SessionType[]).map(item => (
                    <button key={item} onClick={() => setType(item)} className={`group rounded-2xl border p-6 text-left transition-all hover:-translate-y-0.5 ${
                      type === item ? "border-violet-400/60 bg-violet-500/10 shadow-[0_10px_50px_rgba(124,58,237,.12)]" : "border-white/10 bg-black/20 hover:border-white/20"
                    }`}>
                      <div className="text-3xl">{item === "pyrogram" ? "✈️" : "⚡"}</div>
                      <div className="mt-5 font-semibold capitalize">{item}</div>
                      <div className="mt-1 text-xs text-zinc-500">{item === "pyrogram" ? "Modern MTProto client" : "Python MTProto framework"}</div>
                    </button>
                  ))}
                </div>
                <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4 text-xs leading-5 text-amber-100/80">
                  Authorize only an account you own or have explicit permission to administer.
                </div>
                <button disabled={loading} onClick={begin} className="mx-auto mt-6 flex w-full max-w-2xl items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold shadow-[0_12px_40px_rgba(79,70,229,.2)] disabled:opacity-60">
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <>Continue <ArrowRight size={18}/></>}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="mx-auto max-w-2xl">
                <div className="text-center">
                  <Smartphone className="mx-auto mb-4 text-violet-300" size={34}/>
                  <div className="text-3xl font-semibold">Verify account</div>
                  <p className="mt-2 text-sm text-zinc-500">Enter your phone number to continue the demo workflow.</p>
                </div>
                <label className="mt-8 block text-xs font-medium text-zinc-400">PHONE NUMBER</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 outline-none transition focus:border-violet-400/60" />
                <button onClick={() => setQr(!qr)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-4 text-sm text-zinc-300 hover:bg-white/5">
                  <QrCode size={18}/> {qr ? "Hide QR option" : "Use QR login"}
                </button>
                {qr && <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-6 text-center"><div className="mx-auto grid h-40 w-40 place-items-center rounded-xl bg-white text-4xl font-black text-black">QR</div><p className="mt-3 text-xs text-zinc-500">UI placeholder — no real credential is collected.</p></div>}
                <div className="mt-7 flex items-center justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft size={16}/> Back</button>
                  <button disabled={loading} onClick={continuePhone} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={16}/> : <>Continue <ArrowRight size={16}/></>}</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto max-w-2xl">
                <div className="text-center">
                  <ShieldCheck className="mx-auto mb-4 text-violet-300" size={38}/>
                  <div className="text-3xl font-semibold">Security review</div>
                  <p className="mt-2 text-sm text-zinc-500">Before finishing, review the privacy guarantees.</p>
                </div>
                <div className="mt-8 space-y-3">
                  {["Temporary flow state expires automatically.", "Authentication secrets are never written to application logs.", "Production deployment should use HTTPS only.", "Never share a real Telegram session credential."].map(x => (
                    <div key={x} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300"><Check size={18} className="shrink-0 text-emerald-400"/>{x}</div>
                  ))}
                </div>
                <div className="mt-7 flex items-center justify-between">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white"><ArrowLeft size={16}/> Back</button>
                  <button onClick={() => setStep(4)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold">View result <ArrowRight size={16}/></button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Check size={28}/></div>
                  <div className="mt-4 text-3xl font-semibold">Session result</div>
                  <p className="mt-2 text-sm text-zinc-500">Demo output — not a real Telegram credential.</p>
                </div>
                <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-4">
                    <code className="min-w-0 flex-1 break-all text-xs leading-6 text-zinc-300">{demoOutput}</code>
                    <button onClick={() => { navigator.clipboard?.writeText(demoOutput); setCopied(true); setTimeout(() => setCopied(false), 1400); }} className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"><Copy size={14} className="mr-1 inline"/>{copied ? "Copied" : "Copy"}</button>
                  </div>
                </div>
                <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100/80">
                  <b className="text-amber-200">Security warning:</b> real Telegram session strings are bearer credentials. Keep them private and revoke them if exposed.
                </div>
                <button onClick={reset} className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold">Create another</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
