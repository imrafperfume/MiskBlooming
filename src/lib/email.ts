import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY!);
// Generic email sender for legacy/auth purposes
export async function sendMail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    const data = await resend.emails.send({
      from: 'Miskblooming <noreply@miskblooming.com>',
      to: [to],
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("sendMail Error:", error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(order: any, user: any) {
  const { id, totalAmount, items, deliveryDate, address, city, paymentMethod } = order;

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">AED ${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">AED ${item.price * item.quantity}</td>
    </tr>
  `).join(''); // Note: Updated to include 'product' relation in type

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
        .content { padding: 30px 0; }
        .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
        .status-badge { display: inline-block; padding: 5px 10px; background: #e6f3ff; color: #0066cc; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MISK BLOOMING</div>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${user.firstName}!</h2>
          <p>We have received your order and are preparing it with care.</p>
          
          <div class="order-details">
            <p><strong>Order ID:</strong> #${id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Delivery Date:</strong> ${deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Standard Delivery'}</p>
             <p><strong>Shipping Address:</strong><br>
            ${address}, ${city}</p>
          </div>

          <h3>Order Summary</h3>
          <table class="table">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total">
            Total: AED ${totalAmount.toFixed(2)}
          </div>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>&copy; ${new Date().getFullYear()} Misk Blooming. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Miskblooming <noreply@miskblooming.com>', // Ensure domain is verified in Resend
      to: [user.email],
      subject: `Order Confirmation #${id} - Misk Blooming`,
      html: html,
    });
    console.log("Invoice Email Sent:", data);
    return data;
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return null; // Don't throw, just log
  }
}

export async function sendMembershipCardEmail(card: any, user: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Membership Card</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
        .card-preview { background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); padding: 20px; border-radius: 16px; color: #000; margin: 20px 0; text-align: center; }
        .card-number { font-family: monospace; font-size: 24px; letter-spacing: 2px; margin: 15px 0; font-weight: bold; }
        .details { margin-top: 20px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .label { color: #666; font-size: 14px; }
        .value { font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MISK BLOOMING</div>
          <p>Welcome to our exclusive membership club</p>
        </div>
        
        <h3>Hello ${user.firstName},</h3>
        <p>We are delighted to present your digital membership card. Please keep this code handy for your exclusive benefits.</p>

        <div class="card-preview">
          <div style="font-size: 14px; font-weight: bold; opacity: 0.8;">MISK BLOOMING MEMBERSHIP</div>
          <div class="card-number">${card.cardNumber}</div>
          <div style="font-size: 12px; font-weight: bold;">${card.membershipType}</div>
        </div>

        <div class="details">
          <div class="detail-row">
            <span class="label">Card Holder</span>
            <span class="value">${card.cardHolderName}</span>
          </div>
          <div class="detail-row">
            <span class="label">Expiration Date</span>
            <span class="value">${new Date(card.expirationDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status</span>
            <span class="value" style="color: green;">Active</span>
          </div>
        </div>

        <div class="footer">
          <p>Login to your account to view your full benefits.</p>
          <p>&copy; ${new Date().getFullYear()} Misk Blooming. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Miskblooming <noreply@miskblooming.com>',
      to: [user.email],
      subject: `Your Membership Card - Misk Blooming`,
      html: html,
    });
    console.log("Membership Email Sent:", data);
    return data;
  } catch (error: any) {
    console.error("Failed to send membership email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, code: string, firstName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Code</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: 1px; }
        .code-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .code { font-family: 'Courier New', monospace; font-size: 42px; letter-spacing: 8px; color: #fff; font-weight: bold; margin: 10px 0; }
        .code-label { color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: #fff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">MISK BLOOMING</div>
          <p>Password Reset Request</p>
        </div>
        
        <div class="content">
          <h3>Hello ${firstName},</h3>
          <p>We received a request to reset your password. Use the code below to complete the process:</p>

          <div class="code-container">
            <div class="code-label">Your Reset Code</div>
            <div class="code">${code}</div>
          </div>

          <p>Enter this code on the password reset page to create a new password.</p>

          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This code will expire in <strong>15 minutes</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this code with anyone</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 14px;">
            For security reasons, we cannot reset your password without this code. 
            If you need help, please contact our support team.
          </p>
        </div>

        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Misk Blooming. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: 'Miskblooming <noreply@miskblooming.com>',
      to: [email],
      subject: 'Password Reset Code - Misk Blooming',
      html: html,
    });
    console.log("Password Reset Email Sent:", data);
    return data;
  } catch (error: any) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
