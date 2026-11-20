"use server";

// The popup's sign-in: checks the single-use token, links
// (x.marketplaceId, user.id) to the Lintel account, and hands back to the
// popup page, which tells the frame and closes.
import { redirect } from "next/navigation";

import { saveLink } from "./agent-links";
import { readConnectToken, spendConnectToken } from "./connect-token";

export async function connectAgent(formData: FormData) {
  const claims = readConnectToken(String(formData.get("token") ?? ""));
  if (!claims || !spendConnectToken(claims)) redirect("/connect?expired=1");

  // Demo sign-in: a real app authenticates the agent here first.
  const account = claims.name ? `${claims.name.split(" ")[0]}'s site` : "your site";
  saveLink(claims.marketplaceId, claims.userId, account);
  redirect("/connect/done");
}
