/*
function buildLinkedInPrompt({ prompt, tone, goal }) {
  return `
You are an expert LinkedIn content writer.

Write a polished LinkedIn post based on the details below.

User idea:
${prompt}

Tone:
${tone}

Goal:
${goal}

Instructions:
- Write in a natural, professional human tone
- Keep paragraphs short and readable
- Start with a strong hook
- Make it sound natural, not robotic
- Keep it suitable for LinkedIn
- The main post must NOT include hashtags
- Provide exactly 3 relevant hashtags
- End with a thoughtful CTA
- Return valid JSON only
- Do not add markdown code fences

Return this exact structure:
{
  "post": "Main post body here",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "cta": "Thoughtful closing line or question"
}
`;
}

module.exports = {
  buildLinkedInPrompt,
};
*/


function buildLinkedInPostPrompt({ prompt, tone, goal }) {
  return `
You are an expert LinkedIn content writer.
Write a polished LinkedIn post based on the information below.

Idea:
${prompt}

Tone:
${tone}

Goal:
${goal}

Rules:
- Start with a strong hook
- Use short readable paragraphs
- No emojis
- No hashtags
- Professional human tone
- Clear structure
- End with a reflective line
`;
}

function buildRewritePrompt({ text, tone }) {
  return `
Rewrite the following text for a LinkedIn audience:

${text}

Rewrite tone:
${tone}

Rules:
- Keep the meaning intact
- Improve clarity
- No emojis
- No hashtags
- Professional tone suitable for LinkedIn
`;
}

function buildHookPrompt({ prompt, tone }) {
  return `
Write a strong 1–2 line LinkedIn hook.

Topic:
${prompt}

Tone:
${tone}

Rules:
- No emojis
- No hashtags
- Attention-grabbing
- No clickbait
`;
}

function buildSummaryPrompt({ prompt, tone }) {
  return `
Summarize the following idea into a concise, readable LinkedIn post.

Idea:
${prompt}

Tone:
${tone}

Rules:
- Short paragraphs
- Professional tone
- No emojis
- No hashtags
- Make it scannable and easy to read
`;
}

function buildBulletToPostPrompt({ bullets, tone, goal }) {
  return `
Convert the following bullet points into a structured LinkedIn post:

${bullets.map(b => "- " + b).join("\n")}

Tone:
${tone}

Goal:
${goal}

Rules:
- Turn bullets into flowing paragraphs
- No emojis
- No hashtags
- Start with a hook
- Keep paragraphs short
`;
}

function buildExpandPrompt({ text, tone }) {
  return `
Expand the following short text into a full LinkedIn-style post:

${text}

Tone:
${tone}

Rules:
- Add insights and storytelling
- No emojis
- No hashtags
- 3–6 short paragraphs
- Professional, friendly tone
`;
}

function buildToneShiftPrompt({ text, tone }) {
  return `
Rewrite the following text into a new tone style:

Text:
${text}

New tone:
${tone}

Rules:
- Do NOT change the meaning
- Only adjust tone and style
- No emojis or hashtags
`;
}

module.exports = {
  buildLinkedInPostPrompt,
  buildRewritePrompt,
  buildHookPrompt,
  buildSummaryPrompt,
  buildBulletToPostPrompt,
  buildExpandPrompt,
  buildToneShiftPrompt
};
