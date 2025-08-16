import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY!);
export async function sendMail(to: string, subject: string, html: string) {
    try {
        const d = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>', to, subject, html
        });
        return console.log("email send", d)
    } catch (error: any) {
        return error.message
    }
}
