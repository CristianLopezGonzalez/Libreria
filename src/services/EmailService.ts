import { Resend } from "resend";
import { config } from "../config/env";

export class EmailService {

    constructor() {
        this.sendEmail = this.sendEmail.bind(this);
        this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
    }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {

            const resendClient = new Resend(config.RESEND_API_KEY);

            await resendClient.emails.send({
                from: `BookTracker <${config.RESEND_DOMAIN}>`,
                to,
                subject,
                html
            });

        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email");
        }
    }

    async sendVerificationEmail(email: string, verificationToken: string, nick: string): Promise<void> {
        try {
            // Construir URL de verificación (ajusta según tu dominio)
            const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
                        .warning { color: #d32f2f; font-size: 12px; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bienvenido a BookTracker</h1>
                        </div>
                        <div class="content">
                            <p>¡Hola ${nick}!</p>
                            <p>Gracias por registrarte en BookTracker. Para completar tu registro, necesitas verificar tu dirección de correo electrónico.</p>
                            
                            <center>
                                <a href="${verificationUrl}" class="button">Verificar Email</a>
                            </center>
 
                            <p>O copia y pega este enlace en tu navegador:</p>
                            <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 3px;">
                                ${verificationUrl}
                            </p>
 
                            <p class="warning">
                                <strong>Nota:</strong> Este enlace expira en 24 horas por razones de seguridad.
                            </p>
 
                            <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 BookTracker. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            await this.sendEmail(email, "Verifica tu correo electrónico - BookTracker", html);

        } catch (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Failed to send verification email");
        }
    }

}