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

export default function EngineeringTemplate5({ data }: Props) {
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
		<div className="min-h-screen bg-[#0a0c10] text-[#c5c6c7] p-6 sm:p-12 font-sans flex flex-col gap-8 selection:bg-cyan-500/25 selection:text-white">
			{/* Grid Lines Overlay */}
			<div
				className="absolute inset-0 opacity-5 pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(#66fcf1 1px, transparent 1px), linear-gradient(90deg, #66fcf1 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="max-w-6xl mx-auto w-full flex flex-col gap-8 relative z-10">
				{/* Top Ribbon */}
				<div className="border border-[#1f2833] bg-[#0b0c10]/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-[#66fcf1] animate-ping" />
						<span className="h-2 w-2 rounded-full bg-[#66fcf1] absolute" />
						<span className="text-xs uppercase tracking-widest text-[#66fcf1] font-mono ml-2">
							SYSTEM ACTIVE
						</span>
					</div>
					<div className="text-xs font-mono text-[#45a29e]">
						SRC // INDEX_PORTFOLIO.SYS
					</div>
				</div>

				{/* Grid Layout Main */}
				<div className="grid gap-8 md:grid-cols-[1.4fr_0.9fr]">
					{/* HERO PANEL */}
					<section className="border border-[#1f2833] bg-[#151a24]/40 rounded-2xl p-8 flex flex-col justify-between shadow-lg">
						<div>
							<span className="text-xs uppercase tracking-widest font-mono text-[#66fcf1]">
								01 // IDENTITY
							</span>
							<h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mt-4">
								{data.name}
							</h1>
							<p className="text-lg md:text-xl text-[#45a29e] font-mono mt-2 uppercase tracking-wide">
								{data.title || "Systems Engineer"}
							</p>
							<p className="text-[#94a3b8] mt-6 leading-relaxed max-w-2xl text-sm md:text-base">
								{data.bio}
							</p>
						</div>

						<div className="mt-8 flex flex-wrap gap-3">
							{resume && (
								<a
									href={resume}
									target="_blank"
									rel="noreferrer"
									className="border border-[#66fcf1] text-[#66fcf1] hover:bg-[#66fcf1]/10 px-6 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider transition"
								>
									Fetch Resume
								</a>
							)}
						</div>
					</section>

					{/* SKILLS PANEL */}
					<section className="border border-[#1f2833] bg-[#151a24]/40 rounded-2xl p-8 flex flex-col gap-6 shadow-lg">
						<span className="text-xs uppercase tracking-widest font-mono text-[#66fcf1]">
							02 // CAPABILITIES
						</span>

						<div className="flex flex-col gap-4 font-mono text-xs">
							<div>
								<div className="text-[#45a29e] mb-2 uppercase tracking-wider">
									[ Frontend Stack ]
								</div>
								<div className="flex flex-wrap gap-2">
									{frontendSkills.map((s) => (
										<span
											key={s}
											className="border border-[#1f2833] bg-[#0b0c10] px-3 py-1.5 rounded-md text-white hover:border-[#66fcf1]/30 transition"
										>
											{s}
										</span>
									))}
								</div>
							</div>
							<div>
								<div className="text-[#45a29e] mb-2 uppercase tracking-wider">
									[ Backend Systems ]
								</div>
								<div className="flex flex-wrap gap-2">
									{backendSkills.map((s) => (
										<span
											key={s}
											className="border border-[#1f2833] bg-[#0b0c10] px-3 py-1.5 rounded-md text-white hover:border-[#66fcf1]/30 transition"
										>
											{s}
										</span>
									))}
								</div>
							</div>
							<div>
								<div className="text-[#45a29e] mb-2 uppercase tracking-wider">
									[ Database Node ]
								</div>
								<div className="flex flex-wrap gap-2">
									{databaseSkills.map((s) => (
										<span
											key={s}
											className="border border-[#1f2833] bg-[#0b0c10] px-3 py-1.5 rounded-md text-white hover:border-[#66fcf1]/30 transition"
										>
											{s}
										</span>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* PROJECTS SECTION */}
				<section className="border border-[#1f2833] bg-[#151a24]/40 rounded-2xl p-8 flex flex-col gap-6 shadow-lg">
					<div>
						<span className="text-xs uppercase tracking-widest font-mono text-[#66fcf1]">
							03 // PROJECTS INDEX
						</span>
						<p className="text-xs text-[#45a29e] font-mono mt-1">
							QUERY_RESULT: {projects.length} RECORDS FOUND
						</p>
					</div>

					{projects.length > 0 ? (
						<div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
							{/* Projects selector */}
							<div className="flex flex-col gap-3 font-mono text-xs">
								{projects.map((p, idx) => (
									<div
										key={idx}
										onClick={() => setActiveProjectIdx(idx)}
										className={`p-5 rounded-xl cursor-pointer transition-all border ${
											activeProjectIdx === idx
												? "border-[#66fcf1] bg-[#66fcf1]/5 text-white"
												: "border-[#1f2833] bg-[#0b0c10]/45 hover:border-[#45a29e]"
										}`}
									>
										<div className="flex justify-between items-center">
											<span className="font-bold">
												{idx + 1}. {p.name.toUpperCase()}
											</span>
											<span>{activeProjectIdx === idx ? "ACTIVE" : "VIEW"}</span>
										</div>
										<p className="text-[11px] text-[#94a3b8] font-sans mt-3 line-clamp-2 leading-relaxed">
											{p.description}
										</p>
										<div className="flex flex-wrap gap-1.5 mt-3.5">
											{p.tech.map((t) => (
												<span
													key={t}
													className="text-[9px] border border-[#1f2833] bg-black px-2 py-0.5 rounded"
												>
													{t}
												</span>
											))}
										</div>
									</div>
								))}
							</div>

							{/* Interactive browser frame */}
							<div>
								{activeProjectIdx !== null && (
									<div className="border border-[#1f2833] bg-[#0b0c10]/60 rounded-xl p-5 h-full flex flex-col justify-between gap-4">
										<div>
											<h3 className="text-lg font-bold text-white uppercase tracking-tight">
												{projects[activeProjectIdx].name}
											</h3>
											<p className="text-sm text-[#cbd5e1] mt-2 leading-relaxed">
												{projects[activeProjectIdx].description}
											</p>
											<div className="mt-4 flex gap-3 font-mono text-xs">
												{projects[activeProjectIdx].github && (
													<a
														href={ensureUrl(projects[activeProjectIdx].github)}
														target="_blank"
														rel="noreferrer"
														className="border border-[#1f2833] text-white hover:bg-slate-800 px-4 py-2 rounded transition"
													>
														SOURCE_CODE
													</a>
												)}
												{projects[activeProjectIdx].live && (
													<a
														href={ensureUrl(projects[activeProjectIdx].live)}
														target="_blank"
														rel="noreferrer"
														className="bg-[#66fcf1] text-[#0b0c10] font-bold px-4 py-2 rounded hover:opacity-90 transition"
													>
														RUN_PREVIEW
													</a>
												)}
											</div>
										</div>

										{/* Iframe */}
										{projects[activeProjectIdx].live && (
											<div className="rounded-xl border border-[#1f2833] overflow-hidden bg-black flex flex-col shadow-inner">
												<div className="bg-[#151a24] px-4 py-2 flex items-center justify-between border-b border-[#1f2833]">
													<div className="flex gap-1.5">
														<span className="w-2 h-2 rounded-full bg-[#1f2833]" />
														<span className="w-2 h-2 rounded-full bg-[#1f2833]" />
														<span className="w-2 h-2 rounded-full bg-[#1f2833]" />
													</div>
													<div className="text-[10px] text-slate-400 select-all truncate max-w-[200px] sm:max-w-xs font-mono bg-black/50 px-2.5 py-0.5 rounded border border-[#1f2833]">
														{projects[activeProjectIdx].live}
													</div>
													<a
														href={ensureUrl(projects[activeProjectIdx].live)}
														target="_blank"
														rel="noreferrer"
														className="text-[10px] text-[#66fcf1] hover:underline"
													>
														LAUNCH ↗
													</a>
												</div>
												<div className="relative h-[280px] w-full bg-slate-950">
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
						<div className="rounded-xl border border-dashed border-[#1f2833] p-10 text-center text-slate-500 text-sm font-mono">
							// LISTING IS EMPTY
						</div>
					)}
				</section>

				{/* GITHUB PANEL */}
				{githubUsername && (
					<section className="border border-[#1f2833] bg-[#151a24]/40 rounded-2xl p-8 flex flex-col gap-6 shadow-lg">
						<span className="text-xs uppercase tracking-widest font-mono text-[#66fcf1]">
							04 // OPEN SOURCE METRICS
						</span>

						{!githubUsername ? (
							<div className="border border-dashed border-[#1f2833] p-8 text-center text-slate-500 text-xs font-mono rounded-xl">
								NO_GITHUB_LINKED
							</div>
						) : githubLoading ? (
							<div className="border border-dashed border-[#1f2833] p-8 text-center text-[#66fcf1] text-xs font-mono rounded-xl animate-pulse">
								LOADING_STATISTICS...
							</div>
						) : githubError || !githubData ? (
							<div className="border border-dashed border-red-500/30 p-8 text-center text-red-400 text-xs font-mono rounded-xl">
								ERROR_RESOLVING_NODE: {githubError || "Unknown"}
							</div>
						) : (
							<div className="flex flex-col gap-6 font-mono text-xs">
								<div className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
									{/* Left side console */}
									<div className="flex flex-col gap-4">
										{/* Numeric stats */}
										<div className="border border-[#1f2833] bg-[#0b0c10] p-4 rounded-xl space-y-2">
											<div className="text-[#66fcf1] font-bold border-b border-[#1f2833] pb-1 mb-2">
												// GENERAL_STATS
											</div>
											<div className="flex justify-between">
												<span>PUBLIC_REPOS:</span>
												<span className="text-white">
													{githubData.stats.publicRepos}
												</span>
											</div>
											<div className="flex justify-between">
												<span>FOLLOWERS:</span>
												<span className="text-white">
													{githubData.stats.followers}
												</span>
											</div>
											<div className="flex justify-between">
												<span>STARS_RECEIVED:</span>
												<span className="text-white">
													{githubData.stats.totalStars}
												</span>
											</div>
										</div>

										{/* Tech distribution */}
										<div className="border border-[#1f2833] bg-[#0b0c10] p-4 rounded-xl">
											<div className="text-[#66fcf1] font-bold border-b border-[#1f2833] pb-1 mb-3">
												// LANGUAGE_WEIGHTS
											</div>
											<div className="space-y-3">
												{githubData.languages.map((lang: any) => (
													<div key={lang.name} className="space-y-1">
														<div className="flex justify-between text-[11px]">
															<span>{lang.name}</span>
															<span className="text-[#66fcf1]">
																{lang.percentage}%
															</span>
														</div>
														<div className="h-1.5 w-full bg-[#1f2833] rounded-sm overflow-hidden">
															<div
																className="h-full bg-[#66fcf1]"
																style={{ width: `${lang.percentage}%` }}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Right side repo list */}
									<div className="flex flex-col gap-4">
										{/* Top Repos */}
										<div className="border border-[#1f2833] bg-[#0b0c10] p-4 rounded-xl">
											<div className="text-[#66fcf1] font-bold border-b border-[#1f2833] pb-1 mb-3">
												// MAIN_REPOSITORIES
											</div>
											<div className="grid gap-3 sm:grid-cols-2">
												{githubData.topRepos.map((repo: any) => (
													<a
														href={repo.url}
														target="_blank"
														rel="noreferrer"
														key={repo.name}
														className="p-3 border border-[#1f2833] bg-black/35 hover:border-[#66fcf1] rounded-lg transition flex flex-col justify-between"
													>
														<div>
															<div className="font-bold text-white truncate">
																{repo.name.toUpperCase()}
															</div>
															<p className="text-[10px] text-slate-400 font-sans mt-1.5 line-clamp-2">
																{repo.description}
															</p>
														</div>
														<div className="mt-3 flex items-center justify-between text-[10px] border-t border-[#1f2833] pt-1.5 text-slate-400">
															<span>⭐ {repo.stars}</span>
															<span className="text-[#66fcf1]">
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
								<div className="border border-[#1f2833] bg-[#0b0c10] p-4 rounded-xl flex flex-col items-center">
									<div className="text-[#66fcf1] font-bold border-b border-[#1f2833] pb-1 mb-3 w-full">
										// CONTRIBUTION_GRAPH
									</div>
									<img
										src={`https://ghchart.rshah.org/66fcf1/${githubUsername}`}
										alt={`${githubUsername}'s Contributions`}
										className="w-full h-auto opacity-75"
									/>
								</div>
							</div>
						)}
					</section>
				)}

				{/* CONTACT PANEL */}
				<section className="border border-[#1f2833] bg-[#151a24]/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
					<div>
						<span className="text-xs uppercase tracking-widest font-mono text-[#66fcf1]">
							05 // CONTACT
						</span>
						<h2 className="text-2xl font-black text-white tracking-tight mt-2 uppercase">
							Establish Connection
						</h2>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto font-mono text-xs">
						{email && (
							<a
								href={`mailto:${email}`}
								className="text-center text-white border border-[#1f2833] hover:border-[#66fcf1] bg-[#0b0c10] px-6 py-3.5 rounded-xl transition"
							>
								EMAIL
							</a>
						)}
						{linkedin && (
							<a
								href={linkedin}
								target="_blank"
								rel="noreferrer"
								className="text-center text-white border border-[#1f2833] hover:border-[#66fcf1] bg-[#0b0c10] px-6 py-3.5 rounded-xl transition"
							>
								LINKEDIN
							</a>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
