"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/actions/newsletter/subscribe";
import { subscribeSchema, type SubscribeFormData } from "@/lib/validations/newsletter";

export default function NewsletterSection() {
  const [subscribed, setSubscribed]   = useState(false);
  const [pending, startTransition]    = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormData>({ resolver: zodResolver(subscribeSchema) });

  function onSubmit(data: SubscribeFormData) {
    const fd = new FormData();
    fd.set("email", data.email);
    if (data.full_name) fd.set("full_name", data.full_name);

    startTransition(async () => {
      const res = await subscribeToNewsletter(fd);
      if (res.success) {
        setSubscribed(true);
        reset();
      } else {
        toast.error(res.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Soft background wash */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/60 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-blue-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-blue-900/30">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/25 rounded-full blur-[70px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-[70px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">

            {/* ── Left: copy ─────────────────────────────────────── */}
            <div className="flex-1">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Stay in the Loop
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                Get term updates, school news, and important announcements
                delivered straight to your inbox.
              </p>
              <p className="mt-4 text-blue-300/70 text-sm">
                No spam. Unsubscribe at any time.
              </p>
            </div>

            {/* ── Right: form / success ───────────────────────────── */}
            <div className="w-full lg:w-[420px] shrink-0">
              {subscribed ? (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-10 text-center">
                  <div className="w-14 h-14 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    You&apos;re subscribed!
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Thank you for joining. You&apos;ll receive our next update in your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {/* Name */}
                  <Input
                    placeholder="Your name (optional)"
                    autoComplete="name"
                    {...register("full_name")}
                    className="h-12 bg-white/10 border-white/25 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/60 rounded-xl"
                  />

                  {/* Email */}
                  <div>
                    <Input
                      type="email"
                      placeholder="Your email address *"
                      autoComplete="email"
                      {...register("email")}
                      className="h-12 bg-white/10 border-white/25 text-white placeholder:text-white/50 focus-visible:ring-white/30 focus-visible:border-white/60 rounded-xl"
                    />
                    {errors.email && (
                      <p className="text-red-300 text-xs mt-1.5 ml-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={pending}
                    className="w-full h-12 bg-white text-blue-900 hover:bg-white/90 font-semibold rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    {pending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Subscribe to Newsletter
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
