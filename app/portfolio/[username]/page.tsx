import { supabase } from "@/lib/supabaseClient";
import EngineeringTemplate1 from "@/app/components/EngineeringTemplate1";
import EngineeringTemplate2 from "@/app/components/EngineeringTemplate2";
import EngineeringTemplate3 from "@/app/components/EngineeringTemplate3";
import EngineeringTemplate4 from "@/app/components/EngineeringTemplate4";
import EngineeringTemplate5 from "@/app/components/EngineeringTemplate5";

export const dynamic = "force-dynamic";

type PortfolioPageProps = {
	params: Promise<{
		username: string;
	}>;
};

export default async function PortfolioPage(props: PortfolioPageProps) {
	const params = await props.params;
	const username = params.username ? decodeURIComponent(params.username).trim().toLowerCase() : "";

	const { data } = await supabase
		.from("portfolios")
		.select("*")
		.eq("username", username)
		.maybeSingle();

	if (!data) {
		return <div className="p-10 text-center font-sans">Portfolio not found</div>;
	}

	const portfolioData = data.data;
	const template = data.template;

	// TEMPLATE SWITCH
	if (template === "engineering-basic") {
		return <EngineeringTemplate1 data={portfolioData} />;
	}
	if (template === "engineering-terminal") {
		return <EngineeringTemplate2 data={portfolioData} />;
	}
	if (template === "engineering-aurora") {
		return <EngineeringTemplate3 data={portfolioData} />;
	}
	if (template === "engineering-editorial") {
		return <EngineeringTemplate4 data={portfolioData} />;
	}
	if (template === "engineering-techgrid") {
		return <EngineeringTemplate5 data={portfolioData} />;
	}

	// Fallback to basic if template string is unrecognized
	return <EngineeringTemplate1 data={portfolioData} />;
}
