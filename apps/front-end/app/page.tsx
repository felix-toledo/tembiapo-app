import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Page() {
	const cookieStore: any = cookies();
	const refresh = cookieStore?.get?.("refresh-token");

	if (refresh) {
		// user seems authenticated (has refresh token) -> go to dashboard
		redirect("/dashboard");
	}

	// not authenticated -> go to login
	redirect("/login");
}

