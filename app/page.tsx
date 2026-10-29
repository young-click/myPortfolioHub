"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [hasPortfolio, setHasPortfolio] = useState(false);

	useEffect(() => {
		async function checkUser() {
			const { data: { session } } = await supabase.auth.getSession();
			if (session) {
				setUser(session.user);
				// Check if they already have a portfolio
				const { data } = await supabase
					.from("portfolios")
					.select("username")
					.eq("username", session.user.email)
					.maybeSingle();
				if (data) {
					setHasPortfolio(true);
				}
			}
			setLoading(false);
		}
		checkUser();
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setHasPortfolio(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-slate-100">
				<div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-400 border-t-transparent"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans flex flex-col justify-between">
			{/* Top Navigation Header */}
			<header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<a href="/" className="font-bold text-white text-lg hover:text-cyan-400 transition-colors">
						PortfolioHub
					</a>
					<div className="flex items-center gap-4">
						{user ? (
							<>
								<span className="text-xs text-slate-400 font-mono hidden sm:inline">
									{user.email}
								</span>
								<button
									onClick={handleSignOut}
									className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/50 hover:text-red-400 transition-all duration-200 cursor-pointer bg-slate-900/50"
								>
									Sign Out
								</button>
							</>
						) : (
							<Link
								href="/login"
								className="text-xs px-4 py-2 rounded-lg bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 font-bold transition-all duration-200 cursor-pointer"
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</header>

			{/* Background radial highlights */}
			<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

			{/* Main Hero Area */}
			<main className="max-w-4xl mx-auto px-6 py-16 flex-grow flex flex-col justify-center items-center relative z-10 w-full">
				<div className="text-center mb-12">
					<span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3 inline-block animate-pulse">
						AI-Powered Portfolio Builder
					</span>
					<h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
						Build a Premium Portfolio <br />
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
							In Seconds
						</span>
					</h1>
					<p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg">
						Simply import your PDF resume. Our Gemini AI automatically parses it to craft a high-end personal website with stunning themes.
					</p>
				</div>

				{/* User Action Center */}
				{user && (
					<div className="w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 mb-8 text-center">
						<h3 className="font-semibold text-lg text-white mb-2 font-sans">Welcome back!</h3>
						<p className="text-sm text-slate-400 mb-4">
							{hasPortfolio 
								? "Your premium portfolio is live and ready." 
								: "You haven't created your portfolio yet."}
						</p>
						<div className="flex gap-4 justify-center">
							{hasPortfolio && (
								<Link
									href={`/portfolio/${encodeURIComponent(user.email)}`}
									className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500 hover:text-cyan-400 transition-all cursor-pointer"
								>
									View Portfolio
								</Link>
							)}
							<Link
								href="/create/engineering"
								className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
							>
								{hasPortfolio ? "Edit Portfolio" : "Get Started"}
							</Link>
						</div>
					</div>
				)}

				{/* Selection Cards */}
				<div className="w-full max-w-2xl">
					<h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
						Select your professional track
					</h2>
					<div className="grid gap-4 md:grid-cols-3">
						<Link
							href="/create/engineering"
							className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)] transition-all duration-300 transform hover:-translate-y-1"
						>
							<div>
								<div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
									</svg>
								</div>
								<h3 className="font-bold text-white mb-2 text-base group-hover:text-cyan-400 transition-colors">Engineering</h3>
								<p className="text-xs text-slate-450 leading-relaxed">For developers, engineers, and tech-driven roles.</p>
							</div>
						</Link>

						<Link
							href="/create/mba"
							className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all duration-300 transform hover:-translate-y-1"
						>
							<div>
								<div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0h.008v.008h-.008v-.008Zm-9.698 0h.008v.008h-.008v-.008Z" />
									</svg>
								</div>
								<h3 className="font-bold text-white mb-2 text-base group-hover:text-purple-400 transition-colors">MBA Student</h3>
								<p className="text-xs text-slate-455 leading-relaxed">Tailored for business administration management tracks.</p>
							</div>
						</Link>

						<Link
							href="/create/professional"
							className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all duration-300 transform hover:-translate-y-1"
						>
							<div>
								<div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m16.5-18v18m-18-18H21.75M12 3v18m-6-6h12m-12-6h12" />
									</svg>
								</div>
								<h3 className="font-bold text-white mb-2 text-base group-hover:text-emerald-400 transition-colors">Professional</h3>
								<p className="text-xs text-slate-455 leading-relaxed">For experienced hires and general executive fields.</p>
							</div>
						</Link>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 z-10 relative">
				&copy; {new Date().getFullYear()} PortfolioHub. All rights reserved.
			</footer>
		</div>
	);
}
