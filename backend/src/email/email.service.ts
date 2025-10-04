import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendWelcomeEmail(userEmail: string, firstName: string) {
    const htmlContent = this.getWelcomeEmailTemplate(firstName);
    
    const mailOptions = {
      from: `"Engracedsmile Travel & Logistics" <${this.configService.get('SMTP_USER')}>`,
      to: userEmail,
      subject: 'Welcome to Engracedsmile! 🚌✨',
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendBookingConfirmationEmail(userEmail: string, firstName: string, bookingDetails: any) {
    const htmlContent = this.getBookingConfirmationTemplate(firstName, bookingDetails);
    
    const mailOptions = {
      from: `"Engracedsmile Travel & Logistics" <${this.configService.get('SMTP_USER')}>`,
      to: userEmail,
      subject: `Booking Confirmation - ${bookingDetails.route} 🎫`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Engracedsmile</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: linear-gradient(135deg, #5d4a15 0%, #6b5618 100%);
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 80px;
                height: 60px;
                margin-bottom: 20px;
            }
            .title {
                color: white;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #f0f0f0;
                font-size: 16px;
                margin-bottom: 30px;
            }
            .content {
                background: white;
                border-radius: 10px;
                padding: 30px;
                margin: 20px 0;
            }
            .greeting {
                font-size: 20px;
                color: #5d4a15;
                margin-bottom: 20px;
            }
            .features {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
            }
            .feature {
                text-align: center;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #5d4a15;
            }
            .feature-icon {
                font-size: 24px;
                margin-bottom: 10px;
            }
            .feature-title {
                font-weight: bold;
                color: #5d4a15;
                margin-bottom: 5px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #5d4a15 0%, #6b5618 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                color: #f0f0f0;
                font-size: 14px;
                margin-top: 30px;
            }
            @media (max-width: 600px) {
                .features {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">Welcome to Engracedsmile! 🚌</div>
                <div class="subtitle">Your trusted travel and logistics partner</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${firstName}! 👋</div>
                
                <p>Welcome to Engracedsmile Travel & Logistics! We're thrilled to have you join our community of satisfied travelers and logistics customers.</p>
                
                <p>With Engracedsmile, you can:</p>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🚌</div>
                        <div class="feature-title">Book Travel</div>
                        <div>Comfortable and safe journeys across Nigeria</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📦</div>
                        <div class="feature-title">Track Shipments</div>
                        <div>Real-time tracking for your packages</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">💳</div>
                        <div class="feature-title">Secure Payments</div>
                        <div>Safe and reliable payment processing</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">📱</div>
                        <div class="feature-title">Mobile App</div>
                        <div>Download our PWA for easy access</div>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://engracedsmile.com/dashboard" class="cta-button">Access Your Dashboard</a>
                </div>
                
                <p>If you have any questions or need assistance, don't hesitate to contact our support team at <strong>+2348071116229</strong> or email us at <strong>info@engracedsmile.com</strong>.</p>
                
                <p>Thank you for choosing Engracedsmile. We look forward to serving you!</p>
                
                <p>Best regards,<br>
                <strong>The Engracedsmile Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2024 Engracedsmile Travel & Logistics. All rights reserved.</p>
                <p>This email was sent to ${userEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getBookingConfirmationTemplate(firstName: string, bookingDetails: any): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: linear-gradient(135deg, #5d4a15 0%, #6b5618 100%);
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                color: white;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #f0f0f0;
                font-size: 16px;
                margin-bottom: 30px;
            }
            .content {
                background: white;
                border-radius: 10px;
                padding: 30px;
                margin: 20px 0;
            }
            .greeting {
                font-size: 20px;
                color: #5d4a15;
                margin-bottom: 20px;
            }
            .booking-details {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #5d4a15;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            .detail-label {
                font-weight: bold;
                color: #5d4a15;
            }
            .detail-value {
                color: #333;
            }
            .total {
                border-top: 2px solid #5d4a15;
                padding-top: 10px;
                margin-top: 15px;
                font-size: 18px;
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #5d4a15 0%, #6b5618 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                text-align: center;
                color: #f0f0f0;
                font-size: 14px;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">Booking Confirmed! 🎫</div>
                <div class="subtitle">Your travel is secured with Engracedsmile</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${firstName}! 👋</div>
                
                <p>Great news! Your booking has been successfully confirmed. We're excited to be part of your journey.</p>
                
                <div class="booking-details">
                    <h3 style="color: #5d4a15; margin-top: 0;">Booking Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">${bookingDetails.bookingId || 'BK' + Date.now()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Route:</span>
                        <span class="detail-value">${bookingDetails.route || 'Lagos to Abuja'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${bookingDetails.date || new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${bookingDetails.time || '08:00 AM'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Passengers:</span>
                        <span class="detail-value">${bookingDetails.passengers || '1'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Seat(s):</span>
                        <span class="detail-value">${bookingDetails.seats || 'A1'}</span>
                    </div>
                    <div class="detail-row total">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value">₦${bookingDetails.amount || '15,000'}</span>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://engracedsmile.com/dashboard" class="cta-button">View Booking Details</a>
                </div>
                
                <p><strong>Important Reminders:</strong></p>
                <ul>
                    <li>Please arrive at the terminal 30 minutes before departure</li>
                    <li>Bring a valid ID for verification</li>
                    <li>Keep this confirmation email for reference</li>
                    <li>Contact us at +2348071116229 for any changes</li>
                </ul>
                
                <p>Thank you for choosing Engracedsmile for your travel needs. We look forward to providing you with a comfortable and safe journey!</p>
                
                <p>Safe travels!<br>
                <strong>The Engracedsmile Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2024 Engracedsmile Travel & Logistics. All rights reserved.</p>
                <p>This email was sent to ${userEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
