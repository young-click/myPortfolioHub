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

export default function EngineeringTemplate4({ data }: Props) {
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
		<div className="min-h-screen bg-[#FBFBF9] text-[#1c1917] font-sans antialiased p-6 sm:p-12 md:p-16 flex flex-col gap-16 selection:bg-[#1c1917]/10">
			{/* HERO SECTION */}
			<header className="max-w-4xl mx-auto w-full flex flex-col gap-8 border-b border-stone-200 pb-12">
				<div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-500">
					<span>Portfolio Hub</span>
					<span>Engineering student</span>
				</div>

				<div className="flex flex-col gap-4">
					<h1 className="text-5xl md:text-7xl font-serif tracking-tight text-stone-900 leading-tight">
						{data.name}
					</h1>
					<p className="text-lg md:text-xl font-medium italic text-stone-600">
						{data.title || "Full Stack Developer"}
					</p>
				</div>

				<p className="text-base md:text-lg leading-relaxed text-stone-700 max-w-2xl">
					{data.bio}
				</p>

				{/* SKILLS */}
				<div className="grid gap-6 sm:grid-cols-3 pt-8 border-t border-stone-150">
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
							Frontend
						</h3>
						<div className="flex flex-wrap gap-2">
							{frontendSkills.map((s) => (
								<span
									key={s}
									className="text-xs bg-stone-100 text-stone-800 px-3 py-1 border border-stone-200/60 rounded"
								>
									{s}
								</span>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
							Backend
						</h3>
						<div className="flex flex-wrap gap-2">
							{backendSkills.map((s) => (
								<span
									key={s}
									className="text-xs bg-stone-100 text-stone-800 px-3 py-1 border border-stone-200/60 rounded"
								>
									{s}
								</span>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
							Data Layer
						</h3>
						<div className="flex flex-wrap gap-2">
							{databaseSkills.map((s) => (
								<span
									key={s}
									className="text-xs bg-stone-100 text-stone-800 px-3 py-1 border border-stone-200/60 rounded"
								>
									{s}
								</span>
							))}
						</div>
					</div>
				</div>
			</header>

			{/* PROJECTS SECTION */}
			<section className="max-w-4xl mx-auto w-full flex flex-col gap-8 border-b border-stone-200 pb-16">
				<div>
					<h2 className="text-3xl font-serif tracking-tight text-stone-900">
						Featured Projects
					</h2>
					<p className="text-stone-500 text-xs uppercase tracking-widest mt-1">
						Interactive portfolio index
					</p>
				</div>

				{projects.length > 0 ? (
					<div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
						{/* Left side list */}
						<div className="flex flex-col gap-4">
							{projects.map((p, idx) => (
								<div
									key={idx}
									onClick={() => setActiveProjectIdx(idx)}
									className={`p-6 rounded-2xl cursor-pointer transition-all border ${
										activeProjectIdx === idx
											? "border-stone-950 bg-stone-50 shadow-sm"
											: "border-stone-200 bg-transparent hover:border-stone-400"
									}`}
								>
									<h3 className="text-lg font-serif font-bold text-stone-900">
										{p.name}
									</h3>
									<p className="text-sm text-stone-600 mt-2 line-clamp-3 leading-relaxed">
										{p.description}
									</p>
									<div className="flex flex-wrap gap-1.5 mt-4">
										{p.tech.map((t) => (
											<span
												key={t}
												className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-100/50 px-2 py-0.5 rounded border border-stone-200"
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
								<div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 flex flex-col justify-between h-full">
									<div>
										<h3 className="text-2xl font-serif text-stone-900">
											{projects[activeProjectIdx].name}
										</h3>
										<p className="text-sm text-stone-700 mt-3 leading-relaxed">
											{projects[activeProjectIdx].description}
										</p>
										<div className="mt-4 flex gap-3">
											{projects[activeProjectIdx].github && (
												<a
													href={ensureUrl(projects[activeProjectIdx].github)}
													target="_blank"
													rel="noreferrer"
													className="text-xs text-stone-900 border border-stone-950 bg-transparent hover:bg-stone-100 px-4 py-2 rounded transition"
												>
													GitHub Code
												</a>
											)}
											{projects[activeProjectIdx].live && (
												<a
													href={ensureUrl(projects[activeProjectIdx].live)}
													target="_blank"
													rel="noreferrer"
													className="text-xs text-white bg-stone-900 hover:bg-stone-850 px-5 py-2.5 rounded transition shadow-sm font-medium"
												>
													Visit Live Site
												</a>
											)}
										</div>
									</div>

									{/* Iframe */}
									{projects[activeProjectIdx].live && (
										<div className="mt-6 rounded-xl border border-stone-200 overflow-hidden bg-white flex flex-col shadow-sm">
											<div className="bg-stone-100 px-4 py-2 flex items-center justify-between border-b border-stone-200">
												<div className="flex gap-1.5">
													<span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
													<span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
													<span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
												</div>
												<div className="text-[10px] text-stone-600 select-all truncate max-w-[200px] sm:max-w-xs font-mono bg-white px-3 py-1 rounded border border-stone-200">
													{projects[activeProjectIdx].live}
												</div>
												<a
													href={ensureUrl(projects[activeProjectIdx].live)}
													target="_blank"
													rel="noreferrer"
													className="text-[10px] text-stone-800 font-bold hover:underline"
												>
													GO ↗
												</a>
											</div>
											<div className="relative h-[280px] w-full bg-stone-50">
												<iframe
													src={ensureUrl(projects[activeProjectIdx].live)}
													className="w-full h-full border-none bg-stone-50"
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
					<div className="rounded-2xl border border-stone-200 p-8 text-center text-stone-400">
						No projects listed.
					</div>
				)}
			</section>

			{/* GITHUB SECTION */}
			{githubUsername && (
				<section className="max-w-4xl mx-auto w-full flex flex-col gap-6 border-b border-stone-200 pb-16">
					<div>
						<h2 className="text-3xl font-serif tracking-tight text-stone-900">
							Open Source Contributions
						</h2>
						<p className="text-stone-500 text-xs uppercase tracking-widest mt-1">
							Live GitHub activity profile
						</p>
					</div>

					{!githubUsername ? (
						<div className="rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-sm italic bg-stone-50/20">
							No GitHub account linked.
						</div>
					) : githubLoading ? (
						<div className="rounded-2xl border border-stone-200 p-8 text-center text-stone-450 text-sm animate-pulse bg-stone-50/20">
							Loading stats and contributions...
						</div>
					) : githubError || !githubData ? (
						<div className="rounded-2xl border border-red-200 p-8 text-center text-red-600 text-sm bg-red-50/30">
							Could not resolve GitHub details: {githubError || "Unknown"}
						</div>
					) : (
						<div className="flex flex-col gap-6">
							<div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
								{/* Left Column Stats */}
								<div className="flex flex-col gap-6">
									{/* Stats Cards Row */}
									<div className="grid grid-cols-3 gap-3 text-center">
										<div className="border border-stone-200 bg-stone-50/50 p-4 rounded-xl">
											<p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
												Repos
											</p>
											<p className="text-lg font-serif font-bold text-stone-855 mt-1">
												{githubData.stats.publicRepos}
											</p>
										</div>
										<div className="border border-stone-200 bg-stone-50/50 p-4 rounded-xl">
											<p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
												Followers
											</p>
											<p className="text-lg font-serif font-bold text-stone-855 mt-1">
												{githubData.stats.followers}
											</p>
										</div>
										<div className="border border-stone-200 bg-stone-50/50 p-4 rounded-xl">
											<p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
												Stars
											</p>
											<p className="text-lg font-serif font-bold text-stone-855 mt-1">
												{githubData.stats.totalStars}
											</p>
										</div>
									</div>

									{/* Languages bar */}
									<div className="border border-stone-200 bg-stone-50/50 p-6 rounded-xl">
										<p className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-3">
											Technologies & Languages
										</p>
										<div className="space-y-3.5">
											{githubData.languages.map((lang: any) => (
												<div key={lang.name} className="space-y-1">
													<div className="flex justify-between text-xs text-stone-700">
														<span className="font-serif">{lang.name}</span>
														<span className="font-mono text-[11px] text-stone-500">
															{lang.percentage}%
														</span>
													</div>
													<div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-stone-800"
															style={{ width: `${lang.percentage}%` }}
														/>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Right Column Grid */}
								<div className="flex flex-col gap-6">
									{/* Repos Grid */}
									<div className="border border-stone-200 bg-stone-50/50 p-6 rounded-xl">
										<p className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-4">
											Top Repositories
										</p>
										<div className="grid gap-4 sm:grid-cols-2">
											{githubData.topRepos.map((repo: any) => (
												<a
													href={repo.url}
													target="_blank"
													rel="noreferrer"
													key={repo.name}
													className="p-4 border border-stone-200 bg-white hover:border-stone-400 transition rounded-xl flex flex-col justify-between"
												>
													<div>
														<div className="font-serif font-bold text-stone-900 truncate text-sm">
															{repo.name}
														</div>
														<p className="text-xs text-stone-500 mt-2 line-clamp-2">
															{repo.description}
														</p>
													</div>
													<div className="mt-4 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 pt-2 font-mono">
														<span>⭐ {repo.stars}</span>
														<span className="text-stone-600 font-sans uppercase font-bold text-[9px] tracking-wider">
															{repo.language}
														</span>
													</div>
												</a>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Contribution graph - Full Width */}
							<div className="border border-stone-200 bg-stone-50/50 p-6 rounded-xl flex flex-col items-center w-full mt-4">
								<p className="text-xs uppercase font-bold text-stone-400 tracking-wider w-full text-left mb-4">
									GitHub Contribution Calendar
								</p>
								<img
									src={`https://ghchart.rshah.org/1c1917/${githubUsername}`}
									alt={`${githubUsername}'s Contributions`}
									className="w-full h-auto opacity-70 filter contrast-[1.2]"
								/>
							</div>
						</div>
					)}
				</section>
			)}

			{/* CONTACT + RESUME */}
			<section className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8">
				<div>
					<h2 className="text-3xl font-serif tracking-tight text-stone-900">
						Get In Touch
					</h2>
					<p className="text-stone-500 text-sm mt-1 max-w-sm">
						Available for conversations, project team-ups, and internships.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					{email && (
						<a
							href={`mailto:${email}`}
							className="text-center text-xs font-semibold uppercase tracking-wider text-stone-700 border border-stone-300 hover:border-stone-600 px-6 py-3.5 rounded transition"
						>
							Send Email
						</a>
					)}
					{linkedin && (
						<a
							href={linkedin}
							target="_blank"
							rel="noreferrer"
							className="text-center text-xs font-semibold uppercase tracking-wider text-stone-700 border border-stone-300 hover:border-stone-600 px-6 py-3.5 rounded transition"
						>
							LinkedIn
						</a>
					)}
					{resume && (
						<a
							href={resume}
							target="_blank"
							rel="noreferrer"
							className="text-center text-xs font-bold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 px-6 py-3.5 rounded transition shadow-sm"
						>
							View Resume
						</a>
					)}
				</div>
			</section>
		</div>
	);
}
