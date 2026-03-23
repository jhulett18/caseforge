"use client";
import { Agentation } from "agentation";

export default function AgentationWrapper() {
  if (process.env.NEXT_PUBLIC_AGENTATION !== "true") return null;
  return <Agentation />;
}
