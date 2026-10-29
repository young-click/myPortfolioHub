import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username")?.trim();

		if (!username) {
			return NextResponse.json(
				{ error: "Username query parameter is required." },
				{ status: 450 },
			);
		}

		const token = process.env.GITHUB_TOKEN;
		const headers: HeadersInit = {
			Accept: "application/vnd.github.v3+json",
		};
		if (token) {
			headers["Authorization"] = `token ${token}`;
		}

		// Fetch profile data
		const profileRes = await fetch(`https://api.github.com/users/${username}`, {
			headers,
		});
		if (!profileRes.ok) {
			if (profileRes.status === 404) {
				return NextResponse.json(
					{ error: "GitHub user not found" },
					{ status: 404 },
				);
			}
			throw new Error(`GitHub Profile API returned status ${profileRes.status}`);
		}
		const profileData = await profileRes.json();

		// Fetch repositories (up to 100)
		const reposRes = await fetch(
			`https://api.github.com/users/${username}/repos?per_page=100`,
			{ headers },
		);
		let reposData = [];
		if (reposRes.ok) {
			reposData = await reposRes.json();
		}

		// Filter non-fork repositories
		const ownRepos = Array.isArray(reposData)
			? reposData.filter((r: any) => !r.fork)
			: [];

		// Sort by stars descending to find top repos
		const topRepos = [...ownRepos]
			.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
			.slice(0, 4)
			.map((r: any) => ({
				name: r.name,
				description: r.description || "No description provided.",
				stars: r.stargazers_count,
				forks: r.forks_count,
				language: r.language || "Unknown",
				url: r.html_url,
			}));

		// Calculate language distribution
		const languageCounts: { [key: string]: number } = {};
		let totalCount = 0;
		ownRepos.forEach((r: any) => {
			if (r.language) {
				languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
				totalCount++;
			}
		});

		const languages = Object.entries(languageCounts)
			.map(([name, count]) => ({
				name,
				percentage: Math.round((count / totalCount) * 100),
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 5);

		// Calculate total stars count
		const totalStars = ownRepos.reduce(
			(acc: number, r: any) => acc + r.stargazers_count,
			0,
		);

		return NextResponse.json({
			success: true,
			stats: {
				name: profileData.name || profileData.login,
				avatarUrl: profileData.avatar_url,
				bio: profileData.bio || "",
				publicRepos: profileData.public_repos,
				followers: profileData.followers,
				totalStars,
			},
			topRepos,
			languages,
		});
	} catch (error: any) {
		console.error("Error fetching GitHub stats:", error);
		return NextResponse.json(
			{ error: error?.message || "Failed to fetch GitHub stats." },
			{ status: 500 },
		);
	}
}
