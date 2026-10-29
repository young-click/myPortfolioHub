"use client";

import { FormEvent, useState, DragEvent, ChangeEvent, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const splitAndTrim = (value: string) =>
	value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

export default function CreatePortfolio() {
	const [user, setUser] = useState<any>(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [hasExisting, setHasExisting] = useState(false);

	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [bio, setBio] = useState("");

	useEffect(() => {
		async function checkAuthAndFetchPortfolio() {
			const { data: { session } } = await supabase.auth.getSession();
			if (!session) {
				window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
				return;
			}
			setUser(session.user);

			// Automatically default contact email to user's email if empty
			if (session.user.email) {
				setEmail(session.user.email);
			}

			try {
				const { data: existing, error } = await supabase
					.from("portfolios")
					.select("*")
					.eq("username", session.user.email)
					.maybeSingle();

				if (error) {
					console.error("Error fetching existing portfolio:", error);
				}

				if (existing) {
					setHasExisting(true);
					const pData = existing.data;
					if (pData) {
						if (pData.name) setName(pData.name);
						if (pData.title) setTitle(pData.title);
						if (pData.bio) setBio(pData.bio);
						if (pData.skills) {
							if (Array.isArray(pData.skills.frontend))
								setFrontend(pData.skills.frontend.join(", "));
							if (Array.isArray(pData.skills.backend))
								setBackend(pData.skills.backend.join(", "));
							if (Array.isArray(pData.skills.database))
								setDatabase(pData.skills.database.join(", "));
						}
						if (Array.isArray(pData.projects)) {
							setProjects(
								pData.projects.map((p: any) => ({
									name: p.name || "",
									description: p.description || "",
									tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
									github: p.github || "",
									live: p.live || "",
								})),
							);
						}
						if (pData.github) setGithub(pData.github);
						if (pData.resume) setResume(pData.resume);
						if (pData.contact) {
							if (pData.contact.email) setEmail(pData.contact.email);
							if (pData.contact.linkedin) setLinkedin(pData.contact.linkedin);
						}
					}
				}
			} catch (err) {
				console.error("Error loading portfolio data:", err);
			} finally {
				setAuthLoading(false);
			}
		}

		checkAuthAndFetchPortfolio();
	}, []);

	const [frontend, setFrontend] = useState("");
	const [backend, setBackend] = useState("");
	const [database, setDatabase] = useState("");

	const [projects, setProjects] = useState([
		{ name: "", description: "", tech: "", github: "", live: "" },
	]);

	const [github, setGithub] = useState("");
	const [resume, setResume] = useState("");
	const [email, setEmail] = useState("");
	const [linkedin, setLinkedin] = useState("");

	// Resume parsing states
	const [dragActive, setDragActive] = useState(false);
	const [parsing, setParsing] = useState(false);
	const [parsedCount, setParsedCount] = useState(0);

	const handleProjectChange = (
		index: number,
		field: string,
		value: string,
	) => {
		const updated = [...projects];
		updated[index][field as keyof (typeof updated)[0]] = value;
		setProjects(updated);
	};

	const addProject = () => {
		setProjects([
			...projects,
			{ name: "", description: "", tech: "", github: "", live: "" },
		]);
	};

	const handleDrag = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = async (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			await handleResumeUpload(e.dataTransfer.files[0]);
		}
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			await handleResumeUpload(e.target.files[0]);
		}
	};

	const handleResumeUpload = async (file: File) => {
		if (!file) return;

		setParsing(true);
		try {
			const formData = new FormData();
			formData.append("resume", file);

			const res = await fetch("/api/parse-resume", {
				method: "POST",
				body: formData,
			});

			const result = await res.json();
			if (!res.ok || !result.success) {
				throw new Error(result.error || "Failed to parse resume");
			}

			const data = result.data;

			if (data.name) setName(data.name);
			if (data.title) setTitle(data.title);
			if (data.bio) setBio(data.bio);
			if (data.skills) {
				if (Array.isArray(data.skills.frontend))
					setFrontend(data.skills.frontend.join(", "));
				if (Array.isArray(data.skills.backend))
					setBackend(data.skills.backend.join(", "));
				if (Array.isArray(data.skills.database))
					setDatabase(data.skills.database.join(", "));
			}
			if (Array.isArray(data.projects)) {
				setProjects(
					data.projects.map((p: any) => ({
						name: p.name || "",
						description: p.description || "",
						tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
						github: p.github || "",
						live: p.live || "",
					})),
				);
			}
			if (data.github) setGithub(data.github);
			if (data.email) setEmail(data.email);
			if (data.linkedin) setLinkedin(data.linkedin);

			// Trigger highlight animation by incrementing count
			setParsedCount((prev) => prev + 1);
		} catch (error: any) {
			console.error(error);
			alert(`Error parsing resume: ${error.message || error}`);
		} finally {
			setParsing(false);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user || !user.email) {
			alert("You must be logged in to create a portfolio.");
			return;
		}

		const normalizedUsername = user.email.trim().toLowerCase();

		const portfolioData = {
			name,
			title,
			bio,
			skills: {
				frontend: splitAndTrim(frontend),
				backend: splitAndTrim(backend),
				database: splitAndTrim(database),
			},
			projects: projects.map((p) => ({
				name: p.name,
				description: p.description,
				tech: splitAndTrim(p.tech),
				github: p.github,
				live: p.live,
			})),
			github,
			resume,
			contact: {
				email,
				linkedin,
			},
		};

		let error;
		if (hasExisting) {
			const { error: err } = await supabase
				.from("portfolios")
				.update({
					data: portfolioData,
				})
				.eq("username", normalizedUsername);
			error = err;
		} else {
			const { error: err } = await supabase.from("portfolios").insert([
				{
					username: normalizedUsername,
					template: "engineering-basic",
					data: portfolioData,
				},
			]);
			error = err;
		}

		if (error) {
			const message = [
				error.message,
				error.details,
				error.hint,
				error.code ? `Code: ${error.code}` : null,
			]
				.filter(Boolean)
				.join("\n");

			console.error("Error saving portfolio", error);
			alert(`Error saving portfolio\n\n${message}`);
		} else {
			window.location.href = `/create/select-template?username=${encodeURIComponent(normalizedUsername)}`;
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

	const inputClass = "w-full bg-slate-900/50 border border-slate-800/80 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 text-sm mb-3";
	const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2";
	const sectionTitleClass = "text-lg font-bold text-white border-b border-slate-900 pb-2 mb-4";

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
			{/* Top Navigation Header */}
			<header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
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

			<div className="p-6 md:p-10 max-w-2xl mx-auto">
				<h1 className="text-3xl font-extrabold text-white mb-2">
					{hasExisting ? "Edit Your Portfolio" : "Create Your Portfolio"}
				</h1>
				<p className="text-slate-400 text-sm mb-8">
					{hasExisting 
						? "Update your information, upload a new resume to auto-fill, or choose a new style below." 
						: "Fill out the fields or drag and drop your resume to automatically parse and populate your portfolio."}
				</p>

				{/* RESUME UPLOAD ZONE */}
				<div
					onDragEnter={handleDrag}
					onDragOver={handleDrag}
					onDragLeave={handleDrag}
					onDrop={handleDrop}
					className={`mb-8 p-8 border-2 border-dashed rounded-3xl transition-all duration-300 relative text-center flex flex-col items-center justify-center gap-3 backdrop-blur-md ${
						dragActive
							? "border-cyan-400 bg-cyan-500/5 dark:bg-cyan-500/10 scale-[1.01]"
							: "border-slate-800 bg-slate-900/10 hover:border-cyan-500/50"
					}`}
				>
					{parsing ? (
						<div className="flex flex-col items-center justify-center p-4">
							<div className="relative flex items-center justify-center mb-4">
								<div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cyan-400/20 opacity-20"></div>
								<div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-400 border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
							</div>
							<h3 className="font-semibold text-lg text-slate-100">
								Analyzing Resume...
							</h3>
							<p className="text-sm text-slate-400 mt-1 max-w-sm">
								Gemini is reading and structured-parsing your PDF. This will take just a moment.
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-2 cursor-pointer w-full">
							<input
								type="file"
								id="resume-upload"
								className="hidden"
								accept=".pdf"
								onChange={handleFileChange}
							/>
							<label
								htmlFor="resume-upload"
								className="cursor-pointer flex flex-col items-center justify-center w-full"
							>
								<div className="h-14 w-14 rounded-full bg-cyan-400/10 text-cyan-500 flex items-center justify-center mb-3 transition-transform hover:scale-110">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-7 h-7"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
										/>
									</svg>
								</div>
								<h3 className="font-semibold text-lg text-slate-200">
									Import Portfolio from Resume
								</h3>
								<p className="text-sm text-slate-400 mt-1 max-w-sm">
									Drag & drop your PDF resume here, or{" "}
									<span className="text-cyan-500 font-medium hover:underline">
										browse files
									</span>
									.
								</p>
								<p className="text-xs text-slate-500 mt-2">
									Supports PDF resumes. Powered by Gemini AI.
								</p>
							</label>
						</div>
					)}
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					{/* BASIC INFO */}
					<div>
						<h2 className={sectionTitleClass}>Basic Info</h2>

						<label className={labelClass}>Full Name</label>
						<input
							key={`name-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="Full Name"
							onChange={(e) => setName(e.target.value)}
							value={name}
						/>

						<label className={labelClass}>Professional Title</label>
						<input
							key={`title-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="e.g. Full Stack Developer"
							onChange={(e) => setTitle(e.target.value)}
							value={title}
						/>

						<label className={labelClass}>Short Bio</label>
						<textarea
							key={`bio-${parsedCount}`}
							className={`${inputClass} min-h-24 ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="A short introduction about yourself"
							onChange={(e) => setBio(e.target.value)}
							value={bio}
						/>
					</div>

					{/* SKILLS */}
					<div>
						<h2 className={sectionTitleClass}>Skills</h2>

						<label className={labelClass}>Frontend Skills (comma separated)</label>
						<input
							key={`frontend-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="React, Vue, Tailwind CSS"
							onChange={(e) => setFrontend(e.target.value)}
							value={frontend}
						/>

						<label className={labelClass}>Backend Skills (comma separated)</label>
						<input
							key={`backend-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="Node.js, Spring Boot, Go"
							onChange={(e) => setBackend(e.target.value)}
							value={backend}
						/>

						<label className={labelClass}>Database Skills (comma separated)</label>
						<input
							key={`database-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="PostgreSQL, MongoDB, Redis"
							onChange={(e) => setDatabase(e.target.value)}
							value={database}
						/>
					</div>

					{/* PROJECTS */}
					<div>
						<h2 className={sectionTitleClass}>Projects</h2>

						{projects.map((project, index) => (
							<div
								key={`project-card-${parsedCount}-${index}`}
								className={`border border-slate-900 bg-slate-900/25 p-5 mb-5 rounded-2xl transition-all ${
									parsedCount > 0 ? "animate-highlight" : ""
								}`}
							>
								<div className="flex justify-between items-center mb-3">
									<h3 className="text-sm font-semibold text-cyan-400">Project #{index + 1}</h3>
									{projects.length > 1 && (
										<button
											type="button"
											onClick={() => {
												const updated = projects.filter((_, i) => i !== index);
												setProjects(updated);
											}}
											className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer bg-transparent border-none outline-none"
										>
											Remove
										</button>
									)}
								</div>

								<label className={labelClass}>Project Name</label>
								<input
									className={inputClass}
									placeholder="Project Name"
									value={project.name}
									onChange={(e) =>
										handleProjectChange(index, "name", e.target.value)
									}
								/>

								<label className={labelClass}>Description</label>
								<textarea
									className={`${inputClass} min-h-16`}
									placeholder="Describe what you built and your role"
									value={project.description}
									onChange={(e) =>
										handleProjectChange(index, "description", e.target.value)
									}
								/>

								<label className={labelClass}>Tech Stack (comma separated)</label>
								<input
									className={inputClass}
									placeholder="React, Next.js, Prisma"
									value={project.tech}
									onChange={(e) =>
										handleProjectChange(index, "tech", e.target.value)
									}
								/>

								<label className={labelClass}>GitHub Repository Link</label>
								<input
									className={inputClass}
									placeholder="https://github.com/..."
									value={project.github}
									onChange={(e) =>
										handleProjectChange(index, "github", e.target.value)
									}
								/>

								<label className={labelClass}>Live Link (optional)</label>
								<input
									className={inputClass.replace("mb-3", "")}
									placeholder="https://..."
									value={project.live}
									onChange={(e) =>
										handleProjectChange(index, "live", e.target.value)
									}
								/>
							</div>
						))}

						<button
							type="button"
							onClick={addProject}
							className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold cursor-pointer transition-colors bg-transparent border-none outline-none"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							Add Project
						</button>
					</div>

					{/* LINKS */}
					<div>
						<h2 className={sectionTitleClass}>Links</h2>

						<label className={labelClass}>GitHub Username or URL</label>
						<input
							key={`github-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="github.com/yourusername"
							onChange={(e) => setGithub(e.target.value)}
							value={github}
						/>

						<label className={labelClass}>Resume Link (Google Drive / PDF)</label>
						<input
							key={`resume-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="https://drive.google.com/..."
							onChange={(e) => setResume(e.target.value)}
							value={resume}
						/>

						<label className={labelClass}>Contact Email</label>
						<input
							key={`email-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="contact@example.com"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>

						<label className={labelClass}>LinkedIn URL</label>
						<input
							key={`linkedin-${parsedCount}`}
							className={`${inputClass} ${
								parsedCount > 0 ? "animate-highlight" : ""
							}`}
							placeholder="linkedin.com/in/yourusername"
							onChange={(e) => setLinkedin(e.target.value)}
							value={linkedin}
						/>
					</div>

					<button className="w-full mt-4 py-4 rounded-2xl font-bold bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 cursor-pointer text-center text-sm">
						{hasExisting ? "Save & Choose Template" : "Create & Choose Template"}
					</button>
				</form>
			</div>
		</div>
	);
}
