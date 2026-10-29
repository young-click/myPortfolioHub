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

const githubUrl = (value?: string) => {
	if (!value) return "";
	if (value.includes("github.com")) return ensureUrl(value);
	return `https://github.com/${value.replace(/^@/, "").trim()}`;
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

export default function EngineeringTemplate1({ data }: Props) {
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
	const skillCount =
		frontendSkills.length + backendSkills.length + databaseSkills.length;
	const projects = data.projects?.filter((project) => project.name) ?? [];
	const projectCount = projects.length;
	const github = githubUrl(data.github);
	const resume = ensureUrl(data.resume);
	const linkedin = ensureUrl(data.contact?.linkedin);
	const topSkills = [
		...frontendSkills,
		...backendSkills,
		...databaseSkills,
	].slice(0, 6);

	return (
		<div className="min-h-screen bg-[#09111f] text-slate-100">
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
				<div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
				<div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
				<div
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage:
							"linear-gradient(rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px)",
						backgroundSize: "52px 52px",
					}}
				/>
			</div>

			<section className="mx-auto max-w-6xl px-6 pb-14 pt-8 md:px-10 md:pt-12">
				<div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
					<div className="flex items-center gap-3">
						<div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
						<p className="text-sm uppercase tracking-[0.28em] text-cyan-100/80">
							Engineering Student Portfolio
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
						<span>{projectCount} projects</span>
						<span>{skillCount} skills</span>
						<span>Open to internships</span>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr]">
					<div className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/65 p-8 shadow-[0_24px_80px_rgba(3,7,18,0.55)] backdrop-blur">
						<p className="text-sm uppercase tracking-[0.32em] text-cyan-300">
							Builder Mode
						</p>
						<h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight text-white md:text-6xl">
							{data.name}
						</h1>
						<p className="mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
							{data.title || "Engineering student building practical software and systems."}
						</p>
						<p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
							{data.bio}
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							{topSkills.map((skill) => (
								<span
									key={skill}
									className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
								>
									{skill}
								</span>
							))}
						</div>

						<div className="mt-10 flex flex-wrap gap-4">
							{github && (
								<a
									href={github}
									target="_blank"
									rel="noreferrer"
									className="rounded-full bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
								>
									View GitHub
								</a>
							)}
							{resume && (
								<a
									href={resume}
									target="_blank"
									rel="noreferrer"
									className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
								>
									View Resume
								</a>
							)}
							{linkedin && (
								<a
									href={linkedin}
									target="_blank"
									rel="noreferrer"
									className="rounded-full border border-white/15 bg-transparent px-6 py-3 font-medium text-slate-200 transition hover:border-cyan-300/45 hover:text-cyan-100"
								>
									LinkedIn
								</a>
							)}
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
							<p className="text-xs uppercase tracking-[0.28em] text-slate-400">
								Current Focus
							</p>
							<div className="mt-5 grid grid-cols-2 gap-4">
								<div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
									<p className="text-3xl font-semibold text-white">
										{projectCount}
									</p>
									<p className="mt-2 text-sm text-slate-400">
										Hands-on projects shipped
									</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
									<p className="text-3xl font-semibold text-white">
										{skillCount}
									</p>
									<p className="mt-2 text-sm text-slate-400">
										Technologies explored
									</p>
								</div>
							</div>
							<p className="mt-5 text-sm leading-7 text-slate-400">
								This portfolio highlights academic curiosity, project execution,
								and internship-ready engineering fundamentals.
							</p>
						</div>

						<div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/5 p-6">
							<p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
								Reach Out
							</p>
							<div className="mt-4 space-y-3 text-sm text-slate-200">
								<p>{data.contact?.email || "Email coming soon"}</p>
								<p>{data.title || "Engineering Student"}</p>
								<p>Interested in internships, team projects, and technical collaboration.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
				<div className="grid gap-6 lg:grid-cols-3">
					{[
						{
							label: "Frontend Stack",
							items: frontendSkills,
							accent: "border-cyan-400/25",
						},
						{
							label: "Backend Systems",
							items: backendSkills,
							accent: "border-emerald-400/25",
						},
						{
							label: "Data Layer",
							items: databaseSkills,
							accent: "border-sky-400/25",
						},
					].map((group) => (
						<div
							key={group.label}
							className={`rounded-[1.75rem] border ${group.accent} bg-slate-950/55 p-6`}
						>
							<p className="text-sm uppercase tracking-[0.28em] text-slate-400">
								{group.label}
							</p>
							<div className="mt-5 flex flex-wrap gap-3">
								{group.items.length > 0 ? (
									group.items.map((item) => (
										<span
											key={item}
											className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
										>
											{item}
										</span>
									))
								) : (
									<p className="text-sm text-slate-500">
										Add skills in the create form to populate this section.
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* GITHUB INTEGRATION */}
			{githubUsername && (
				<section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
					<div className="mb-8">
						<p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
							GitHub Codebase
						</p>
						<h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
							Open Source & Contributions
						</h2>
					</div>

					{githubLoading ? (
						<div className="animate-pulse rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 text-center text-slate-400 font-sans">
							Fetching live GitHub data...
						</div>
					) : githubError || !githubData ? (
						<div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 text-center text-slate-500 text-sm font-sans">
							Could not load GitHub stats. View profile directly:{" "}
							<a
								href={ensureUrl(data.github)}
								target="_blank"
								rel="noreferrer"
								className="text-cyan-450 underline font-semibold"
							>
								{githubUsername}
							</a>
						</div>
					) : (
						<div className="flex flex-col gap-6">
							<div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] font-sans">
								{/* Stats & Languages */}
								<div className="flex flex-col gap-6">
									{/* Stats Card */}
									<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 flex items-center justify-between">
										<div>
											<p className="text-xs uppercase tracking-wider text-slate-400">
												Repos
											</p>
											<p className="text-2xl font-bold text-white mt-1">
												{githubData.stats.publicRepos}
											</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-slate-400">
												Followers
											</p>
											<p className="text-2xl font-bold text-white mt-1">
												{githubData.stats.followers}
											</p>
										</div>
										<div>
											<p className="text-xs uppercase tracking-wider text-slate-400">
												Stars Received
											</p>
											<p className="text-2xl font-bold text-white mt-1">
												{githubData.stats.totalStars}
											</p>
										</div>
									</div>

									{/* Languages Bar */}
									<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6">
										<p className="text-xs uppercase tracking-wider text-slate-400 mb-4">
											Top Languages
										</p>
										<div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-800">
											{githubData.languages.map((lang: any, idx: number) => {
												const colors = [
													"bg-cyan-400",
													"bg-emerald-400",
													"bg-purple-400",
													"bg-yellow-400",
													"bg-pink-400",
												];
												return (
													<div
														key={lang.name}
														className={colors[idx % colors.length]}
														style={{ width: `${lang.percentage}%` }}
														title={`${lang.name}: ${lang.percentage}%`}
													/>
												);
											})}
										</div>
										<div className="flex flex-wrap gap-4 mt-4 text-xs">
											{githubData.languages.map((lang: any, idx: number) => {
												const colors = [
													"bg-cyan-400",
													"bg-emerald-400",
													"bg-purple-400",
													"bg-yellow-400",
													"bg-pink-450",
												];
												return (
													<div
														key={lang.name}
														className="flex items-center gap-1.5"
													>
														<span
															className={`w-2.5 h-2.5 rounded-full ${
																colors[idx % colors.length]
															}`}
														/>
														<span className="text-slate-300">
															{lang.name}
														</span>
														<span className="text-slate-500">
															({lang.percentage}%)
														</span>
													</div>
												);
											})}
										</div>
									</div>
								</div>

								{/* Top Repositories Grid */}
								<div className="grid gap-4 sm:grid-cols-2">
									{githubData.topRepos.map((repo: any) => (
										<a
											href={repo.url}
											target="_blank"
											rel="noreferrer"
											key={repo.name}
											className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
										>
											<div>
												<div className="flex items-center justify-between">
													<span className="font-bold text-white text-base tracking-wide truncate max-w-[80%]">
														{repo.name}
													</span>
													<span className="text-xs text-cyan-300 font-mono">
														↗
													</span>
												</div>
												<p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
													{repo.description}
												</p>
											</div>
											<div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
												<span className="flex items-center gap-1">
													⭐ {repo.stars}
												</span>
												<span className="flex items-center gap-1">
													🍴 {repo.forks}
												</span>
												<span className="ml-auto text-[10px] text-cyan-300 uppercase tracking-widest">
													{repo.language}
												</span>
											</div>
										</a>
									))}
								</div>
							</div>

							{/* Contribution Calendar - Full Width */}
							<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 flex flex-col items-center w-full">
								<p className="text-xs uppercase tracking-wider text-slate-400 w-full mb-3 text-left">
									Contributions
								</p>
								<img
									src={`https://ghchart.rshah.org/22d3ee/${githubUsername}`}
									alt={`${githubUsername}'s GitHub Contributions`}
									className="w-full h-auto opacity-85"
								/>
							</div>
						</div>
					)}
				</section>
			)}

			<section className="mx-auto max-w-6xl px-6 py-14 md:px-10">
				<div className="mb-10 flex items-end justify-between gap-4">
					<div>
						<p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
							Project Lab
						</p>
						<h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
							Engineering work that turns ideas into systems
						</h2>
					</div>
					<p className="max-w-md text-sm leading-7 text-slate-400">
						Selected builds that show problem solving, implementation depth,
						and willingness to experiment.
					</p>
				</div>

				<div className="grid gap-6">
					{projects.length > 0 ? (
						projects.map((project, index) => (
							<div
								key={`${project.name}-${index}`}
								className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_40px_rgba(2,8,23,0.35)] lg:grid-cols-[1.1fr_0.9fr]"
							>
								<div>
									<div className="flex flex-wrap items-center gap-3">
										<span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
											Project {index + 1}
										</span>
										<span className="text-sm text-slate-500">
											Student build
										</span>
									</div>
									<h3 className="mt-4 text-2xl font-semibold text-white">
										{project.name}
									</h3>
									<p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
										{project.description}
									</p>

									<div className="mt-6 flex flex-wrap gap-3">
										{project.tech.filter(Boolean).map((tech) => (
											<span
												key={tech}
												className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200"
											>
												{tech}
											</span>
										))}
									</div>

									<div className="mt-8 flex flex-wrap gap-4">
										{project.github && (
											<a
												href={ensureUrl(project.github)}
												target="_blank"
												rel="noreferrer"
												className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
											>
												Source Code
											</a>
										)}
										{project.live && (
											<a
												href={ensureUrl(project.live)}
												target="_blank"
												rel="noreferrer"
												className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
											>
												Live Demo
											</a>
										)}
									</div>
								</div>

								<div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
									<div className="rounded-[1.25rem] border border-cyan-400/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
										<p className="text-xs uppercase tracking-[0.28em] text-slate-500">
											Engineering Notes
										</p>
										<ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
											<li>Built to solve a concrete problem, not just to check a box.</li>
											<li>Demonstrates applied tools, implementation choices, and iteration.</li>
											<li>Ready to discuss architecture, challenges, and improvements.</li>
										</ul>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-slate-400">
							Add projects in the create form to showcase your engineering work here.
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
