"use server";

import transporter from "@/lib/nodemailer";



export async function sendEmailAction({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta : string;
}) {




  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `${subject}`,
    html: meta,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("[SendEmail]:", err);
    return { success: false };
  }
}