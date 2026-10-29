"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";

interface PortfolioData {
	name: string;
}

const TEMPLATES = [
	{
		id: "engineering-basic",
		name: "Classic Engineering",
		description:
			"A clean, modern layout with a dark blue-grey space aesthetic. Highly readable and professional.",
		bgColor: "bg-slate-900 border-cyan-400/30",
		textColor: "text-cyan-450",
		gradient: "from-slate-900 to-slate-950",
	},
	{
		id: "engineering-terminal",
		name: "Developer Terminal",
		description:
			"A retro-modern terminal style layout with command simulation, glowing greens/cyans, and monospace font.",
		bgColor: "bg-[#0c0f12] border-green-500/30",
		textColor: "text-emerald-450",
		gradient: "from-black to-slate-950",
	},
	{
		id: "engineering-aurora",
		name: "Aurora Glassmorphism",
		description:
			"Sleek glassmorphism overlaying rich neon violet and blue ambient orbs. Extremely modern and visually striking.",
		bgColor: "bg-slate-950 border-purple-500/30",
		textColor: "text-purple-400",
		gradient: "from-slate-950 via-[#0e021a] to-slate-950",
	},
	{
		id: "engineering-editorial",
		name: "Warm Editorial",
		description:
			"A gorgeous light-theme design with high-end typography, warm cream tones, and clean separator lines.",
		bgColor: "bg-[#FBFBF9] border-stone-300",
		textColor: "text-stone-800",
		gradient: "from-[#FBFBF9] to-[#F7F7F4]",
	},
	{
		id: "engineering-techgrid",
		name: "Sleek Tech Grid",
		description:
			"Geometric tech grids, cybernetic accent borders, and high-contrast element nodes. Clean and structured.",
		bgColor: "bg-[#0b0c10] border-cyan-500/20",
		textColor: "text-cyan-400",
		gradient: "from-[#0b0c10] to-[#1f2833]",
	},
];

function SelectTemplateContent() {
	const searchParams = useSearchParams();
	const username = searchParams.get("username")?.trim().toLowerCase();

	const [loading, setLoading] = useState(false);
	const [userNameVal, setUserNameVal] = useState("");
	const [user, setUser] = useState<any>(null);
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			const { data: { session } } = await supabase.auth.getSession();
			if (!session) {
				window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
				return;
			}
			
			const userEmail = session.user.email?.trim().toLowerCase();
			setUser(session.user);

			if (!userEmail) {
				window.location.href = "/login";
				return;
			}

			if (username && userEmail !== username) {
				// Prevent users from accessing other profiles
				window.location.href = `/create/select-template?username=${encodeURIComponent(userEmail)}`;
				return;
			}
			setAuthLoading(false);
		}
		checkAuth();
	}, [username]);

	useEffect(() => {
		if (authLoading || !username) return;
		async function fetchUser() {
			const { data } = await supabase
				.from("portfolios")
				.select("data")
				.eq("username", username)
				.maybeSingle();
			if (data && data.data && (data.data as PortfolioData).name) {
				setUserNameVal((data.data as PortfolioData).name);
			}
		}
		fetchUser();
	}, [username, authLoading]);

	const selectTemplate = async (templateId: string) => {
		if (!username) {
			alert("No username specified in the URL");
			return;
		}
		setLoading(true);
		try {
			const { error } = await supabase
				.from("portfolios")
				.update({ template: templateId })
				.eq("username", username);

			if (error) throw error;

			window.location.href = `/portfolio/${encodeURIComponent(username)}`;
		} catch (err: any) {
			console.error("Error setting template:", err);
			alert(`Error setting template: ${err.message || err}`);
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		window.location.href = "/";
	};

	if (authLoading) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
				<div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-400 border-t-transparent"></div>
			</div>
		);
	}

	if (!username) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans">
				<h1 className="text-2xl font-bold text-red-500">Invalid URL</h1>
				<p className="text-slate-400 mt-2">
					No username parameter was provided.
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 pb-16 relative overflow-hidden font-sans">
			{/* Top Navigation Header */}
			<header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
				<div className="max-w-5xl mx-auto flex items-center justify-between">
					<a href="/" className="font-bold text-white text-lg hover:text-cyan-400 transition-colors">
						PortfolioHub
					</a>
					<div className="flex items-center gap-4">
						<span className="text-xs text-slate-400 font-mono hidden sm:inline">
							{user?.email}
						</span>
						<button
							onClick={handleSignOut}
							className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/50 hover:text-red-400 transition-all duration-200 cursor-pointer bg-slate-900/50"
						>
							Sign Out
						</button>
					</div>
				</div>
			</header>

			{/* Background radial highlights */}
			<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

			<div className="max-w-5xl mx-auto relative z-10 pt-12 px-6">
				<div className="text-center mb-12">
					<p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3 animate-pulse">
						Template Selection
					</p>
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						{userNameVal
							? `Hey ${userNameVal}, Choose Your Style`
							: "Choose Your Portfolio Style"}
					</h1>
					<p className="text-slate-400 max-w-xl mx-auto text-base">
						Select one of our premium, hand-crafted engineering student
						templates. You can change your style at any time.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{TEMPLATES.map((tpl) => (
						<div
							key={tpl.id}
							onClick={() => !loading && selectTemplate(tpl.id)}
							className={`group flex flex-col justify-between rounded-3xl border p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
								tpl.id === "engineering-editorial"
									? "border-stone-200 bg-[#FBFBF9] hover:border-amber-600/50 hover:shadow-amber-500/5 text-stone-900"
									: "border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:shadow-cyan-500/5 text-slate-100"
							}`}
						>
							<div>
								{/* Mock Card Preview Header */}
								<div
									className={`w-full h-32 rounded-2xl bg-gradient-to-br ${tpl.gradient} border border-slate-700/30 mb-5 relative overflow-hidden flex items-center justify-center p-3`}
								>
									<div
										className={`font-mono text-xs opacity-75 ${tpl.textColor}`}
									>
										{`<${tpl.name} />`}
									</div>
									{/* Subtle design accents in preview card */}
									<div className="absolute bottom-2 left-2 right-2 flex gap-1">
										<span className="h-1 w-6 rounded-full bg-slate-500/30" />
										<span className="h-1 w-4 rounded-full bg-slate-500/30" />
										<span className="h-1 w-8 rounded-full bg-slate-500/30" />
									</div>
								</div>

								<h3
									className={`text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors ${
										tpl.id === "engineering-editorial"
											? "group-hover:text-amber-700 text-stone-900"
											: ""
									}`}
								>
									{tpl.name}
								</h3>
								<p
									className={`text-sm leading-relaxed mb-6 ${
										tpl.id === "engineering-editorial"
											? "text-stone-600"
											: "text-slate-400"
									}`}
								>
									{tpl.description}
								</p>
							</div>

							<button
								disabled={loading}
								className={`w-full py-3 rounded-xl font-medium transition-all cursor-pointer ${
									tpl.id === "engineering-editorial"
										? "bg-stone-900 text-stone-50 hover:bg-stone-850"
										: "bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
								}`}
							>
								Select Template
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function SelectTemplatePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-950 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-400 border-t-transparent"></div>
				</div>
			}
		>
			<SelectTemplateContent />
		</Suspense>
	);
}
