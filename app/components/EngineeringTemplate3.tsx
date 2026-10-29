"use client";

import { useState, useEffect } from "react";

type Project = {
	name: string;
	description: string;
	tech: string[];
	github: string;
	live?: string;
};

type Props = {
	data: {
		name: string;
		title?: string;
		bio: string;
		skills: {
			frontend?: string[];
			backend?: string[];
			database?: string[];
		};
		projects?: Project[];
		github?: string;
		resume?: string;
		contact?: {
			email?: string;
			linkedin?: string;
		};
	};
};

const ensureUrl = (value?: string) => {
	if (!value) return "";
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	return `https://${value}`;
};

const toList = (items?: string[]) => items?.filter(Boolean) ?? [];

const getGithubUsername = (url?: string) => {
	if (!url) return "";
	const cleaned = url.trim();
	if (cleaned.includes("github.com/")) {
		return cleaned.split("github.com/")[1].split("/")[0].replace(/^@/, "").trim();
	}
	return cleaned.replace(/^@/, "").trim();
};

export default function EngineeringTemplate3({ data }: Props) {
	const [githubData, setGithubData] = useState<any>(null);
	const [githubLoading, setGithubLoading] = useState(false);
	const [githubError, setGithubError] = useState("");

	const githubUsername = getGithubUsername(data.github);

	useEffect(() => {
		if (!githubUsername) return;
		setGithubLoading(true);
		fetch(`/api/github-stats?username=${githubUsername}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch GitHub stats");
				return res.json();
			})
			.then((resData) => {
				if (resData.success) {
					setGithubData(resData);
				} else {
					setGithubError(resData.error || "Failed");
				}
			})
			.catch((err) => setGithubError(err.message))
			.finally(() => setGithubLoading(false));
	}, [githubUsername]);
	const frontendSkills = toList(data.skills?.frontend);
	const backendSkills = toList(data.skills?.backend);
	const databaseSkills = toList(data.skills?.database);
	const projects = data.projects?.filter((project) => project.name) ?? [];
	const resume = ensureUrl(data.resume);
	const linkedin = ensureUrl(data.contact?.linkedin);
	const email = data.contact?.email;

	const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(
		projects.length > 0 ? 0 : null,
	);

	return (
		<div className="min-h-screen bg-[#07020d] text-slate-200 relative overflow-hidden p-6 sm:p-12 selection:bg-fuchsia-500/30 selection:text-white">
			{/* Ambient Glowing Background Orbs */}
			<div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

			<div className="max-w-5xl mx-auto flex flex-col gap-16 relative z-10">
				{/* HERO SECTION */}
				<header className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-semibold uppercase tracking-widest text-fuchsia-300 mb-6">
						<span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
						AVAILABLE FOR INTERNSHIPS
					</div>
					<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
						<span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
							{data.name}
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-cyan-300 font-semibold tracking-wide mt-4">
						{data.title || "Engineering Builder"}
					</p>
					<p className="text-slate-400 mt-6 leading-relaxed max-w-3xl text-base md:text-lg">
						{data.bio}
					</p>

					{/* Skills badges grid */}
					<div className="mt-10 pt-8 border-t border-white/5 flex flex-col gap-6">
						<div>
							<h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-3">
								Frontend Stack
							</h4>
							<div className="flex flex-wrap gap-2.5">
								{frontendSkills.map((s) => (
									<span
										key={s}
										className="text-xs px-3.5 py-1.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-200"
									>
										{s}
									</span>
								))}
							</div>
						</div>
						<div>
							<h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-3">
								Backend & Logic
							</h4>
							<div className="flex flex-wrap gap-2.5">
								{backendSkills.map((s) => (
									<span
										key={s}
										className="text-xs px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-200"
									>
										{s}
									</span>
								))}
							</div>
						</div>
						<div>
							<h4 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-3">
								Data Layer
							</h4>
							<div className="flex flex-wrap gap-2.5">
								{databaseSkills.map((s) => (
									<span
										key={s}
										className="text-xs px-3.5 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-200"
									>
										{s}
									</span>
								))}
							</div>
						</div>
					</div>
				</header>

				{/* PROJECTS SECTION */}
				<section className="flex flex-col gap-8">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-white">
							Project Showroom
						</h2>
						<p className="text-slate-400 text-sm mt-1">
							Explore interactive previews of my featured applications.
						</p>
					</div>

					{projects.length > 0 ? (
						<div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
							{/* Left side list */}
							<div className="flex flex-col gap-4">
								{projects.map((p, idx) => (
									<div
										key={idx}
										onClick={() => setActiveProjectIdx(idx)}
										className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${
											activeProjectIdx === idx
												? "border-fuchsia-500/50 bg-fuchsia-500/5 shadow-[0_0_20px_rgba(240,70,250,0.15)]"
												: "border-white/5 bg-white/[0.01] hover:border-white/15"
										}`}
									>
										<div className="flex items-center gap-3">
											<span className="text-xs font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">
												0{idx + 1}
											</span>
											<h3 className="text-lg font-bold text-white">
												{p.name}
											</h3>
										</div>
										<p className="text-sm text-slate-400 mt-2 line-clamp-3">
											{p.description}
										</p>
										<div className="flex flex-wrap gap-1.5 mt-4">
											{p.tech.map((t) => (
												<span
													key={t}
													className="text-[10px] text-cyan-300 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10"
												>
													{t}
												</span>
											))}
										</div>
									</div>
								))}
							</div>

							{/* Right side interactive iframe preview */}
							<div>
								{activeProjectIdx !== null && (
									<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl h-full flex flex-col justify-between">
										<div>
											<h3 className="text-2xl font-bold text-white tracking-tight">
												{projects[activeProjectIdx].name}
											</h3>
											<p className="text-sm text-slate-300 mt-3 leading-relaxed">
												{projects[activeProjectIdx].description}
											</p>
											<div className="mt-4 flex flex-wrap gap-3">
												{projects[activeProjectIdx].github && (
													<a
														href={ensureUrl(projects[activeProjectIdx].github)}
														target="_blank"
														rel="noreferrer"
														className="text-xs text-white border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition"
													>
														GitHub Code
													</a>
												)}
												{projects[activeProjectIdx].live && (
													<a
														href={ensureUrl(projects[activeProjectIdx].live)}
														target="_blank"
														rel="noreferrer"
														className="text-xs text-slate-950 bg-gradient-to-r from-fuchsia-450 to-cyan-450 hover:opacity-90 font-bold px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(240,70,250,0.3)]"
													>
														Launch Live Project
													</a>
												)}
											</div>
										</div>

										{/* Browser Iframe container */}
										{projects[activeProjectIdx].live && (
											<div className="mt-6 rounded-2xl border border-white/10 overflow-hidden bg-[#07020d] flex flex-col shadow-2xl">
												<div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-white/5">
													<div className="flex gap-1.5">
														<span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
														<span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
														<span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
													</div>
													<div className="text-[10px] text-slate-400 select-all truncate max-w-[200px] sm:max-w-xs font-mono bg-black/40 px-3 py-1 rounded border border-white/5">
														{projects[activeProjectIdx].live}
													</div>
													<a
														href={ensureUrl(projects[activeProjectIdx].live)}
														target="_blank"
														rel="noreferrer"
														className="text-[10px] text-cyan-400 font-bold"
													>
														LAUNCH ↗
													</a>
												</div>
												<div className="relative h-[300px] w-full bg-slate-950">
													<iframe
														src={ensureUrl(projects[activeProjectIdx].live)}
														className="w-full h-full border-none bg-slate-950"
														title={`Live preview of ${projects[activeProjectIdx].name}`}
														sandbox="allow-scripts allow-same-origin"
													/>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center text-slate-500">
							No projects to display.
						</div>
					)}
				</section>

				{/* GITHUB SECTION */}
				{githubUsername && (
					<section className="flex flex-col gap-6">
						<div>
							<h2 className="text-3xl font-bold tracking-tight text-white">
								GitHub Operations
							</h2>
							<p className="text-cyan-300 text-xs font-mono uppercase tracking-widest mt-1">
								SYS // CLONE_METRICS
							</p>
						</div>

						{!githubUsername ? (
							<div className="rounded-3xl border border-white/10 bg-white/[0.01] p-8 text-center text-slate-500 text-sm backdrop-blur-md">
								// No GitHub handle linked.
							</div>
						) : githubLoading ? (
							<div className="rounded-3xl border border-white/10 bg-white/[0.01] p-8 text-center text-fuchsia-400 text-sm backdrop-blur-md animate-pulse">
								// Retrieving live data from GitHub cloud...
							</div>
						) : githubError || !githubData ? (
							<div className="rounded-3xl border border-red-500/20 bg-red-950/10 p-8 text-center text-red-400 text-sm backdrop-blur-md">
								// Error resolving repository: {githubError || "Unknown"}
							</div>
						) : (
							<div className="flex flex-col gap-6">
								<div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
									{/* Stats Card */}
									<div className="flex flex-col gap-6">
										<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl flex justify-between text-center">
											<div>
												<p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
													Repos
												</p>
												<p className="text-xl font-bold text-white mt-1">
													{githubData.stats.publicRepos}
												</p>
											</div>
											<div>
												<p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
													Followers
												</p>
												<p className="text-xl font-bold text-white mt-1">
													{githubData.stats.followers}
												</p>
											</div>
											<div>
												<p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
													Stars
												</p>
												<p className="text-xl font-bold text-white mt-1">
													{githubData.stats.totalStars}
												</p>
											</div>
										</div>

										{/* Languages breakdown */}
										<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
											<p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
												Core Languages
											</p>
											<div className="space-y-4">
												{githubData.languages.map((lang: any) => (
													<div key={lang.name} className="space-y-1.5">
														<div className="flex justify-between text-xs">
															<span className="text-fuchsia-300">
																{lang.name}
															</span>
															<span className="text-slate-455">
																{lang.percentage}%
															</span>
														</div>
														<div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
															<div
																className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
																style={{ width: `${lang.percentage}%` }}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Repositories grid */}
									<div className="flex flex-col gap-6">
										<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
											<p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
												Top Repositories
											</p>
											<div className="grid gap-4 sm:grid-cols-2">
												{githubData.topRepos.map((repo: any) => (
													<a
														href={repo.url}
														target="_blank"
														rel="noreferrer"
														key={repo.name}
														className="p-4 rounded-2xl border border-white/5 bg-[#07020d]/50 hover:border-fuchsia-500/50 transition-all flex flex-col justify-between"
													>
														<div>
															<div className="font-bold text-white truncate text-sm">
																{repo.name}
															</div>
															<p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
																{repo.description}
															</p>
														</div>
														<div className="mt-4 flex items-center justify-between text-[10px] text-slate-355 border-t border-white/5 pt-2">
															<span>⭐ {repo.stars}</span>
															<span className="text-cyan-300">
																{repo.language}
															</span>
														</div>
													</a>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* Contributions graph - Full Width */}
								<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl flex flex-col items-center w-full">
									<p className="text-xs uppercase font-bold tracking-wider text-slate-450 w-full mb-4">
										Activity Map
									</p>
									<img
										src={`https://ghchart.rshah.org/d946ef/${githubUsername}`}
										alt={`${githubUsername}'s Contributions`}
										className="w-full h-auto opacity-75"
									/>
								</div>
							</div>
						)}
					</section>
				)}

				{/* CONTACT + RESUME */}
				<section className="rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-500/5 to-cyan-500/5 p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
					<div>
						<h2 className="text-3xl font-bold text-white tracking-tight">
							Let's Connect
						</h2>
						<p className="text-slate-450 text-sm mt-1 max-w-sm">
							Reach out for internship opportunities, team collaborations, or just to say hello.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
						{email && (
							<a
								href={`mailto:${email}`}
								className="text-center text-xs font-semibold uppercase tracking-wider text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-xl transition"
							>
								Email Me
							</a>
						)}
						{linkedin && (
							<a
								href={linkedin}
								target="_blank"
								rel="noreferrer"
								className="text-center text-xs font-semibold uppercase tracking-wider text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-xl transition"
							>
								LinkedIn
							</a>
						)}
						{resume && (
							<a
								href={resume}
								target="_blank"
								rel="noreferrer"
								className="text-center text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-fuchsia-400 to-cyan-400 hover:opacity-90 px-6 py-3.5 rounded-xl transition shadow-lg"
							>
								View Resume
							</a>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
