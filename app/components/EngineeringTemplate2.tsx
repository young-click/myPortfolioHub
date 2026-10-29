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

export default function EngineeringTemplate2({ data }: Props) {
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
		<div className="min-h-screen bg-[#07090e] text-[#4af626] font-mono p-4 sm:p-8 flex flex-col gap-6 selection:bg-[#4af626]/20 selection:text-white">
			{/* Terminal Header */}
			<div className="w-full max-w-6xl mx-auto rounded-t-xl bg-[#141923] border border-[#2d384e] px-4 py-2.5 flex items-center justify-between shadow-2xl">
				<div className="flex items-center gap-2">
					<span className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] inline-block shadow-[0_0_8px_rgba(255,95,86,0.3)]" />
					<span className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] inline-block shadow-[0_0_8px_rgba(255,189,46,0.3)]" />
					<span className="w-3.5 h-3.5 rounded-full bg-[#27c93f] inline-block shadow-[0_0_8px_rgba(39,201,63,0.3)]" />
				</div>
				<div className="text-xs text-[#a0aec0] font-semibold">
					guest@developer-terminal:~
				</div>
				<div className="w-10" />
			</div>

			{/* Terminal Screen Container */}
			<div className="w-full max-w-6xl mx-auto flex-1 rounded-b-xl border-x border-b border-[#2d384e] bg-[#0c0f16] p-6 shadow-2xl flex flex-col gap-10">
				{/* HERO SECTION */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[#38bdf8]">guest@portfolio</span>
						<span className="text-[#a0aec0]">:</span>
						<span className="text-[#818cf8]">~</span>
						<span className="text-white">$</span>
						<span className="text-white font-semibold">whoami</span>
					</div>
					<div className="pl-4 border-l-2 border-[#4af626]/20 mt-1">
						<h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
							{data.name}
						</h1>
						<p className="text-xl text-[#38bdf8] mt-2 font-medium">
							{data.title || "Software Engineer & Builder"}
						</p>
						<p className="text-[#cbd5e1] mt-4 max-w-3xl leading-relaxed text-sm">
							{data.bio}
						</p>
					</div>

					<div className="flex items-center gap-2 mt-6">
						<span className="text-[#38bdf8]">guest@portfolio</span>
						<span className="text-[#a0aec0]">:</span>
						<span className="text-[#818cf8]">~</span>
						<span className="text-white">$</span>
						<span className="text-white font-semibold">cat skills.json</span>
					</div>
					<div className="pl-4 mt-2 grid gap-4 sm:grid-cols-3">
						<div className="bg-[#141822] p-4 border border-[#2d384e] rounded-lg">
							<div className="text-white font-semibold text-xs border-b border-[#2d384e] pb-1.5 mb-2.5">
								FRONTEND
							</div>
							<div className="flex flex-wrap gap-2">
								{frontendSkills.map((s) => (
									<span
										key={s}
										className="text-xs bg-[#4af626]/10 px-2.5 py-1 rounded border border-[#4af626]/20"
									>
										{s}
									</span>
								))}
							</div>
						</div>
						<div className="bg-[#141822] p-4 border border-[#2d384e] rounded-lg">
							<div className="text-white font-semibold text-xs border-b border-[#2d384e] pb-1.5 mb-2.5">
								BACKEND
							</div>
							<div className="flex flex-wrap gap-2">
								{backendSkills.map((s) => (
									<span
										key={s}
										className="text-xs bg-[#38bdf8]/10 text-[#38bdf8] px-2.5 py-1 rounded border border-[#38bdf8]/20"
									>
										{s}
									</span>
								))}
							</div>
						</div>
						<div className="bg-[#141822] p-4 border border-[#2d384e] rounded-lg">
							<div className="text-white font-semibold text-xs border-b border-[#2d384e] pb-1.5 mb-2.5">
								DATABASES
							</div>
							<div className="flex flex-wrap gap-2">
								{databaseSkills.map((s) => (
									<span
										key={s}
										className="text-xs bg-[#c084fc]/10 text-[#c084fc] px-2.5 py-1 rounded border border-[#c084fc]/20"
									>
										{s}
									</span>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* PROJECTS SECTION */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[#38bdf8]">guest@portfolio</span>
						<span className="text-[#a0aec0]">:</span>
						<span className="text-[#818cf8]">~</span>
						<span className="text-white">$</span>
						<span className="text-white font-semibold">ls -la projects/</span>
					</div>
					<div className="pl-4 mt-2">
						{projects.length > 0 ? (
							<div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
								{/* Left side project list */}
								<div className="flex flex-col gap-2.5">
									{projects.map((p, idx) => (
										<div
											key={idx}
											onClick={() => setActiveProjectIdx(idx)}
											className={`p-4 border rounded-xl cursor-pointer transition-all ${
												activeProjectIdx === idx
													? "border-[#4af626] bg-[#4af626]/5 shadow-[0_0_15px_rgba(74,246,38,0.08)]"
													: "border-[#2d384e] bg-[#141822]/40 hover:border-[#4af626]/55"
											}`}
										>
											<div className="flex items-center justify-between">
												<span className="text-white font-bold tracking-wide">
													{p.name}
												</span>
												<span className="text-xs text-[#a0aec0]">
													[{idx + 1}/{projects.length}]
												</span>
											</div>
											<p className="text-xs text-[#94a3b8] mt-2 line-clamp-2">
												{p.description}
											</p>
											<div className="flex flex-wrap gap-1.5 mt-3">
												{p.tech.map((t) => (
													<span
														key={t}
														className="text-[10px] text-[#38bdf8] bg-[#38bdf8]/5 px-2 py-0.5 rounded border border-[#38bdf8]/10"
													>
														{t}
													</span>
												))}
											</div>
										</div>
									))}
								</div>

								{/* Right side live interactive iframe */}
								<div className="flex flex-col gap-3">
									{activeProjectIdx !== null && (
										<div className="bg-[#141822] border border-[#2d384e] rounded-2xl p-4 h-full flex flex-col justify-between">
											<div>
												<h3 className="text-lg font-bold text-white flex items-center gap-2">
													<span>📂</span> {projects[activeProjectIdx].name}
												</h3>
												<p className="text-sm text-[#cbd5e1] mt-2 leading-relaxed">
													{projects[activeProjectIdx].description}
												</p>
												<div className="mt-4 flex flex-wrap gap-2">
													{projects[activeProjectIdx].github && (
														<a
															href={ensureUrl(
																projects[activeProjectIdx].github,
															)}
															target="_blank"
															rel="noreferrer"
															className="text-xs text-white bg-[#2d384e] px-4 py-2 rounded-lg hover:bg-slate-700 transition"
														>
															view_source_code.sh
														</a>
													)}
													{projects[activeProjectIdx].live && (
														<a
															href={ensureUrl(projects[activeProjectIdx].live)}
															target="_blank"
															rel="noreferrer"
															className="text-xs text-black bg-[#4af626] px-4 py-2 rounded-lg hover:bg-[#3ce01b] transition font-bold"
														>
															live_preview.exe
														</a>
													)}
												</div>
											</div>

											{/* Interactive Iframe */}
											{projects[activeProjectIdx].live && (
												<div className="mt-5 rounded-xl border border-[#2d384e] overflow-hidden bg-black flex flex-col shadow-inner">
													<div className="bg-[#1e2530] px-4 py-2 flex items-center justify-between border-b border-[#2d384e]">
														<div className="flex gap-1.5">
															<span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
															<span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
															<span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
														</div>
														<div className="text-[10px] text-[#cbd5e1] select-all truncate max-w-[200px] sm:max-w-xs font-mono bg-black/45 px-2 py-0.5 rounded border border-[#2d384e]">
															{projects[activeProjectIdx].live}
														</div>
														<a
															href={ensureUrl(projects[activeProjectIdx].live)}
															target="_blank"
															rel="noreferrer"
															className="text-[10px] text-[#38bdf8] hover:underline"
														>
															OPEN ↗
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
							<p className="text-sm text-slate-500">
								// No projects loaded yet.
							</p>
						)}
					</div>
				</section>

				{/* GITHUB SECTION */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[#38bdf8]">guest@portfolio</span>
						<span className="text-[#a0aec0]">:</span>
						<span className="text-[#818cf8]">~</span>
						<span className="text-white">$</span>
						<span className="text-white font-semibold">
							./fetch_github_stats.py --user {githubUsername || "null"}
						</span>
					</div>
					<div className="pl-4">
						{!githubUsername ? (
							<div className="border border-dashed border-[#2d384e] p-6 rounded-xl text-center text-slate-500 text-sm">
								// No GitHub account linked.
							</div>
						) : githubLoading ? (
							<div className="border border-dashed border-[#2d384e] p-6 rounded-xl text-center text-[#4af626]/80 text-sm animate-pulse">
								// Fetching live data from GitHub servers...
							</div>
						) : githubError || !githubData ? (
							<div className="border border-dashed border-red-500/30 p-6 rounded-xl text-center text-red-400 text-sm">
								// Failed to resolve GitHub node: {githubError || "Unknown"}
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
									{/* Left Stats Console */}
									<div className="flex flex-col gap-4">
										<div className="bg-[#141822] border border-[#2d384e] rounded-xl p-4 text-xs space-y-2">
											<div className="text-white font-semibold border-b border-[#2d384e] pb-1.5 mb-2">
												SYSTEM_METRICS
											</div>
											<div>
												<span className="text-[#818cf8]">public_repositories:</span>{" "}
												<span className="text-white">
													{githubData.stats.publicRepos}
												</span>
											</div>
											<div>
												<span className="text-[#818cf8]">user_followers:</span>{" "}
												<span className="text-white">
													{githubData.stats.followers}
												</span>
											</div>
											<div>
												<span className="text-[#818cf8]">total_stargazers:</span>{" "}
												<span className="text-white">
													{githubData.stats.totalStars}
												</span>
											</div>
										</div>

										{/* Language breakdown */}
										<div className="bg-[#141822] border border-[#2d384e] rounded-xl p-4 text-xs">
											<div className="text-white font-semibold border-b border-[#2d384e] pb-1.5 mb-3">
												COMPILER_LANGUAGES
											</div>
											<div className="space-y-3">
												{githubData.languages.map((lang: any) => (
													<div key={lang.name} className="space-y-1">
														<div className="flex justify-between text-[11px]">
															<span className="text-[#38bdf8]">{lang.name}</span>
															<span>{lang.percentage}%</span>
														</div>
														<div className="h-1.5 w-full bg-black/40 rounded overflow-hidden">
															<div
																className="h-full bg-[#4af626]"
																style={{ width: `${lang.percentage}%` }}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Right Repositories console */}
									<div className="flex flex-col gap-4">
										{/* Top Repos */}
										<div className="bg-[#141822] border border-[#2d384e] rounded-xl p-4 text-xs">
											<div className="text-white font-semibold border-b border-[#2d384e] pb-1.5 mb-3">
												TOP_REPOSITORIES
											</div>
											<div className="grid gap-3 sm:grid-cols-2">
												{githubData.topRepos.map((repo: any) => (
													<a
														href={repo.url}
														target="_blank"
														rel="noreferrer"
														key={repo.name}
														className="p-3 border border-[#2d384e] bg-black/25 rounded-lg hover:border-[#4af626] transition flex flex-col justify-between"
													>
														<div>
															<div className="font-bold text-white truncate">
																{repo.name}
															</div>
															<p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
																{repo.description}
															</p>
														</div>
														<div className="mt-3 flex items-center justify-between text-[9px] text-[#cbd5e1] border-t border-[#2d384e]/30 pt-1.5">
															<span>⭐ {repo.stars}</span>
															<span className="text-[#38bdf8]">
																{repo.language}
															</span>
														</div>
													</a>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* Contributions Grid wrapper - Full Width */}
								<div className="bg-[#141822] border border-[#2d384e] rounded-xl p-4 flex flex-col items-center w-full mt-4">
									<div className="text-white font-semibold text-xs border-b border-[#2d384e] pb-1.5 mb-3 w-full">
										CONTRIBUTION_ACTIVITY
									</div>
									<img
										src={`https://ghchart.rshah.org/4af626/${githubUsername}`}
										alt={`${githubUsername}'s Contributions`}
										className="w-full h-auto opacity-80"
									/>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* CONTACT & RESUME SECTION */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[#38bdf8]">guest@portfolio</span>
						<span className="text-[#a0aec0]">:</span>
						<span className="text-[#818cf8]">~</span>
						<span className="text-white">$</span>
						<span className="text-white font-semibold">ping -c 4 contact</span>
					</div>
					<div className="pl-4 mt-2">
						<div className="bg-[#141822] border border-[#2d384e] rounded-xl p-5 max-w-xl">
							<div className="text-sm text-white mb-4">
								PING contact_node (127.0.0.1) 56(84) bytes of data.
							</div>
							<div className="space-y-2 text-sm">
								{email && (
									<div>
										<span className="text-[#818cf8]">email:</span>{" "}
										<a
											href={`mailto:${email}`}
											className="text-white hover:underline hover:text-[#4af626]"
										>
											{email}
										</a>
									</div>
								)}
								{linkedin && (
									<div>
										<span className="text-[#818cf8]">linkedin:</span>{" "}
										<a
											href={linkedin}
											target="_blank"
											rel="noreferrer"
											className="text-white hover:underline hover:text-[#4af626]"
										>
											{linkedin}
										</a>
									</div>
								)}
								{resume && (
									<div className="mt-4 pt-4 border-t border-[#2d384e] flex">
										<a
											href={resume}
											target="_blank"
											rel="noreferrer"
											className="bg-[#4af626]/10 text-[#4af626] border border-[#4af626]/50 hover:bg-[#4af626]/20 px-4 py-2 rounded font-semibold tracking-wide transition text-xs"
										>
											DOWNLOAD_RESUME.PDF
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
