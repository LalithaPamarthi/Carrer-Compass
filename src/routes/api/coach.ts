import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Server boundary for CareerLens Coach. The AI key never reaches the browser.
 * The client sends its analysis summary plus the conversation; we build the
 * system prompt server-side so the assistant's grounding rules can't be edited
 * from the client.
 */

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  context: z.string().max(20000).optional(),
  isDemo: z.boolean().optional(),
});

const SYSTEM_PROMPT = `You are CareerLens Coach: part professional recruiter, part honest career coach, part supportive mentor.

Rules you must never break:
- Ground every claim in the ANALYSIS CONTEXT provided. Never invent the user's achievements, metrics, employers, skills or job requirements.
- If something cannot be determined from the context, say so plainly and say what the user would need to add.
- Label your reasoning when it matters: "Fact" (present in the context), "Inference" (your reading of it), "Recommendation" (what to do).
- Be direct about weaknesses, including uncomfortable feedback, but never insulting, discriminatory or discouraging.
- Never guarantee interviews, offers, or that a resume will pass an applicant tracking system. Use language like "compatibility", "signals", "likely improvement areas".
- When rewriting a resume bullet, keep every factual detail the user actually provided and use <placeholders> for numbers they haven't given.
- Keep answers tight: short paragraphs or bullets, no filler preamble. Markdown is fine.`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = BodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "That request wasn't valid. Please try sending your question again." }, { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "The career coach isn't configured yet. Please try again later." }, { status: 500 });
        }

        const contextBlock = parsed.context
          ? `ANALYSIS CONTEXT${parsed.isDemo ? " (SAMPLE DEMO PROFILE — say so if the user seems to think it is their own data)" : ""}:\n${parsed.context}`
          : "ANALYSIS CONTEXT: none available. Tell the user you can only give general guidance until they run an analysis.";

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
            body: JSON.stringify({
              model: "google/gemini-3.7-flash",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "system", content: contextBlock },
                ...parsed.messages,
              ],
            }),
          });

          if (!upstream.ok) {
            const status = upstream.status;
            const message =
              status === 429
                ? "The coach is handling a lot of requests right now. Please wait a moment and try again."
                : status === 402
                  ? "AI usage limits have been reached for this workspace. The owner needs to add credits before the coach can reply."
                  : status === 403
                    ? "AI access is currently blocked for this workspace."
                    : "The coach couldn't respond just now. Please try again.";
            return Response.json({ error: message }, { status });
          }

          const data = (await upstream.json()) as { choices?: { message?: { content?: string } }[] };
          const content = data.choices?.[0]?.message?.content?.trim();
          if (!content) {
            return Response.json({ error: "The coach returned an empty response. Please try rephrasing your question." }, { status: 502 });
          }
          return Response.json({ content });
        } catch {
          return Response.json({ error: "We couldn't reach the coach. Check your connection and try again." }, { status: 502 });
        }
      },
    },
  },
});
