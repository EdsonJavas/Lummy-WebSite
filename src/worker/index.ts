import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

app.get("/api/contact/health", (c) => c.json({ ok: true }));

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    const {
      name,
      email,
      company,
      phone,
      service,
      budget,
      message,
    } = body ?? {};

    if (!name || !email || !message) {
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const apiKey = c.env.RESEND_API_KEY;
    if (!apiKey) {
      return c.json({ error: "Servidor de e-mail não configurado" }, 500);
    }

    const subject = `Novo contato recebido — ${name}`;
    const text = [
      `Nome: ${name}`,
      `Email: ${email}`,
      company ? `Empresa: ${company}` : undefined,
      phone ? `Telefone: ${phone}` : undefined,
      service ? `Serviço: ${service}` : undefined,
      budget ? `Orçamento: ${budget}` : undefined,
      "",
      "Mensagem:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const primaryBlue = '#2563EB';
    const accentPink = '#FF66B3';
    const neutralBg = '#0b1220';
    const lightText = '#ffffff';
    const mutedText = 'rgba(255,255,255,0.75)';

    const html = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${neutralBg};padding:28px 0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width:640px;background:#0f172a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 10px 24px rgba(2,6,23,0.4);">
              <tr>
                <td style="background:linear-gradient(135deg,${primaryBlue},${accentPink});padding:26px;color:#fff;">
                  <div style="font-size:13px;opacity:.95;margin-bottom:8px;letter-spacing:.2px;">Lummy • Soluções Digitais</div>
                  <h1 style="margin:0;font-size:24px;line-height:1.35;font-weight:700;">Você recebeu uma nova mensagem</h1>
                  <div style="opacity:.95;font-size:12px;margin-top:8px;">Enviada pelo formulário de contato do site</div>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:14px;color:${lightText};">
                    <tr>
                      <td style="padding:10px 0;width:180px;color:${mutedText};">Nome</td>
                      <td style="padding:10px 0;color:${lightText};">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;width:180px;color:${mutedText};">E‑mail</td>
                      <td style="padding:10px 0;color:${lightText};">${email}</td>
                    </tr>
                    ${company ? `<tr><td style=\"padding:10px 0;width:180px;color:${mutedText};\">Empresa</td><td style=\"padding:10px 0;color:${lightText};\">${company}</td></tr>` : ""}
                    ${phone ? `<tr><td style=\"padding:10px 0;width:180px;color:${mutedText};\">Telefone</td><td style=\"padding:10px 0;color:${lightText};\">${phone}</td></tr>` : ""}
                    ${service ? `<tr><td style=\"padding:10px 0;width:180px;color:${mutedText};\">Serviço</td><td style=\"padding:10px 0;color:${lightText};\">${service}</td></tr>` : ""}
                    ${budget ? `<tr><td style=\"padding:10px 0;width:180px;color:${mutedText};\">Orçamento</td><td style=\"padding:10px 0;color:${lightText};\">${budget}</td></tr>` : ""}
                  </table>
                  <div style="height:1px;background:rgba(255,255,255,0.12);margin:18px 0;"></div>
                  <div style="font-size:14px;color:${lightText};line-height:1.75;">
                    <div style="color:${mutedText};margin-bottom:10px;">Mensagem</div>
                    <div style="color:${lightText};">${(message ?? "").replace(/\n/g, "<br/>")}</div>
                  </div>
                  <div style="margin-top:22px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:14px;color:${lightText};">
                    <div style="font-weight:600;margin-bottom:6px;">Como responder?</div>
                    <div style="font-size:13px;color:${mutedText};">Basta responder este e‑mail. O campo de resposta já vai para <span style="font-weight:600;color:${lightText};">${email}</span>.</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#0b1220;color:#e2e8f0;padding:18px 24px;font-size:12px;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,${primaryBlue},${accentPink});"></span>
                    <span>Mensagem enviada automaticamente pelo site da Lummy. Este é um canal de contato direto.</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const fromEmail = (c.env as any).FROM_EMAIL || "Lummy <onboarding@resend.dev>";
    const toEmail = (c.env as any).TO_EMAIL || "es553807@gmail.com";

    const sendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        text,
        html,
        reply_to: email ? [email] : undefined,
      }),
    });

    if (!sendResponse.ok) {
      let details: any = undefined;
      try { details = await sendResponse.json(); } catch { details = await sendResponse.text(); }
      return c.json({ error: "Falha ao enviar e‑mail", details }, 502);
    }

    const result = await sendResponse.json();
    return c.json({ success: true, id: result?.id ?? null });
  } catch (err) {
    return c.json({ error: "Requisição inválida" }, 400);
  }
});

export default app;
