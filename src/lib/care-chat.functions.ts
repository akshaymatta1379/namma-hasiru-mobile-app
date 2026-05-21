import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  species: z.string().min(1).max(120),
  scientificName: z.string().max(160).optional(),
  location: z.string().max(200).optional(),
  daysOld: z.number().int().min(0).max(20000).optional(),
  messages: z.array(MessageSchema).min(1).max(40),
});

export const askCareAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: null, error: "AI is not configured. Please add LOVABLE_API_KEY." };
    }

    const system = `You are a friendly, expert horticulturist for the Namma Hasiru tree-tracking app.
You give clear, concise, practical advice about watering, soil, sunlight, mulching, pruning, pests, and diseases.
You answer questions specifically for this plant:
- Common name: ${data.species}${data.scientificName ? ` (${data.scientificName})` : ""}
${data.location ? `- Location: ${data.location}` : ""}
${data.daysOld != null ? `- Age: ${data.daysOld} days since planting` : ""}

Rules:
- Keep answers under 180 words unless the user asks for detail.
- Use short bullet points where helpful.
- Tailor advice to the species, age, and climate (assume tropical/subtropical India unless told otherwise).
- If asked about something unrelated to plant care, gently steer back.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });

      if (res.status === 429) return { reply: null, error: "Rate limit reached. Please try again in a moment." };
      if (res.status === 402) return { reply: null, error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("AI gateway error", res.status, text);
        return { reply: null, error: `AI request failed (${res.status})` };
      }

      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const reply = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!reply) return { reply: null, error: "Empty response from AI." };
      return { reply, error: null };
    } catch (err) {
      console.error("Care assistant failed", err);
      return { reply: null, error: "Could not reach the AI service." };
    }
  });
