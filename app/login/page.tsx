"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function LoginContent() {
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/create/engineering";

	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrorMsg("");
		setSuccessMsg("");

		if (!email || !password) {
			setErrorMsg("Please fill in all fields.");
			return;
		}

		if (isSignUp) {
			if (password !== confirmPassword) {
				setErrorMsg("Passwords do not match.");
				return;
			}
			if (password.length < 6) {
				setErrorMsg("Password must be at least 6 characters.");
				return;
			}
		}

		setLoading(true);
		try {
			if (isSignUp) {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
				});
				if (error) throw error;
				
				if (data.session) {
					setSuccessMsg("Account created successfully! Redirecting...");
					setTimeout(() => {
						window.location.href = redirectTo;
					}, 1500);
				} else {
					setSuccessMsg("Registration successful! Please check your email for a confirmation link.");
				}
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;

				setSuccessMsg("Success! Redirecting...");
				setTimeout(() => {
					window.location.href = redirectTo;
				}, 1000);
			}
		} catch (err: any) {
			console.error("Auth error:", err);
			setErrorMsg(err.message || "An authentication error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-16 px-6 relative overflow-hidden font-sans">
			{/* Background radial highlights */}
			<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

			<div className="max-w-md w-full relative z-10">
				{/* Back to Home Link */}
				<div className="text-center mb-8">
					<a href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
							<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
						</svg>
						Back to Home
					</a>
				</div>

				<div className="bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-extrabold text-white tracking-tight">
							{isSignUp ? "Create your account" : "Welcome back"}
						</h2>
						<p className="text-slate-400 mt-2 text-sm">
							{isSignUp
								? "Join us to manage your premium portfolio"
								: "Sign in to update your portfolio"}
						</p>
					</div>

					{errorMsg && (
						<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm animate-pulse flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
							</svg>
							<span>{errorMsg}</span>
						</div>
					)}

					{successMsg && (
						<div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
							<span>{successMsg}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
								Email Address
							</label>
							<input
								type="email"
								placeholder="you@example.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full bg-slate-950/55 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200 text-sm"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
								Password
							</label>
							<input
								type="password"
								placeholder="••••••••"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full bg-slate-950/55 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200 text-sm"
							/>
						</div>

						{isSignUp && (
							<div className="transition-all duration-300">
								<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
									Confirm Password
								</label>
								<input
									type="password"
									placeholder="••••••••"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full bg-slate-950/55 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200 text-sm"
								/>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full mt-2 py-3.5 rounded-xl font-bold bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm"
						>
							{loading ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></div>
									Processing...
								</div>
							) : isSignUp ? (
								"Create Account"
							) : (
								"Sign In"
							)}
						</button>
					</form>

					<div className="mt-8 pt-6 border-t border-slate-800 text-center">
						<button
							onClick={() => {
								setIsSignUp(!isSignUp);
								setErrorMsg("");
								setSuccessMsg("");
							}}
							className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none"
						>
							{isSignUp
								? "Already have an account? Sign In"
								: "Don't have an account? Sign Up"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-400 border-t-transparent font-sans"></div>
			</div>
		}>
			<LoginContent />
		</Suspense>
	);
}
