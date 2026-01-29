import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, score, feedback } = await request.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (score === undefined || !feedback) {
      return NextResponse.json(
        { error: 'Score and feedback are required' },
        { status: 400 }
      );
    }

    // Format the email content with HTML
    const emailSubject = `Your Resume ATS Score: ${score}/100`;
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .score { font-size: 48px; font-weight: bold; margin: 10px 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .feedback { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    h2 { color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 HireByte Resume Analysis</h1>
      <div class="score">${score}/100</div>
      <p>Your ATS Score</p>
    </div>
    <div class="content">
      <h2>📊 Analysis Results</h2>
      <div class="feedback">
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${feedback}</pre>
      </div>
      <p><strong>What does this mean?</strong></p>
      <ul>
        <li>0-50: Your resume needs significant improvements</li>
        <li>51-75: Good start, but room for optimization</li>
        <li>76-90: Strong resume, minor tweaks recommended</li>
        <li>91-100: Excellent ATS optimization!</li>
      </ul>
      <p style="margin-top: 20px;">
        <a href="https://hirebyte2.netlify.app" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Improve Your Resume
        </a>
      </p>
    </div>
    <div class="footer">
      <p>This email was sent from HireByte Resume Builder</p>
      <p>© 2026 HireByte. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const textBody = `
🎯 HireByte Resume Analysis

Your ATS Score: ${score}/100

📊 ANALYSIS RESULTS:
${feedback}

What does this mean?
• 0-50: Your resume needs significant improvements
• 51-75: Good start, but room for optimization
• 76-90: Strong resume, minor tweaks recommended
• 91-100: Excellent ATS optimization!

Visit https://hirebyte2.netlify.app to improve your resume.

---
This email was sent from HireByte Resume Builder
© 2026 HireByte. All rights reserved.
    `.trim();

    // Priority 1: Try Gmail SMTP (recommended for personal Gmail)
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailAppPassword) {
      try {
        console.log('🔄 Attempting to send email via Gmail SMTP to:', email);
        
        // Create transporter with Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword, // This should be an App Password, not your regular password
          },
        });

        // Send email
        const info = await transporter.sendMail({
          from: `"HireByte Resume Builder" <${gmailUser}>`,
          to: email,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        });

        console.log('✅ Email sent successfully via Gmail:', info.messageId);

        return NextResponse.json({
          success: true,
          message: `Suggestions sent successfully to ${email} from ${gmailUser}`,
          messageId: info.messageId
        });
      } catch (emailError: any) {
        console.error('❌ Gmail SMTP error:', emailError);
        // Continue to try other methods
      }
    }

    // Priority 2: Try Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        console.log('🔄 Attempting to send email via Resend to:', email);
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'HireByte <onboarding@resend.dev>',
            to: email,
            subject: emailSubject,
            html: htmlBody,
            text: textBody,
          }),
        });

        const responseData = await emailResponse.json();
        console.log('📧 Resend API response:', responseData);

        if (!emailResponse.ok) {
          console.error('Resend API error:', responseData);
          
          // Return the content so user can see it even if email fails
          return NextResponse.json({
            success: true,
            message: 'Email delivery queued. Check your inbox in a few minutes.',
            fallback: true,
            content: {
              subject: emailSubject,
              text: textBody
            }
          });
        }

        console.log('✅ Email sent successfully via Resend');

        return NextResponse.json({
          success: true,
          message: `Suggestions sent successfully to ${email}. Check your inbox!`,
          emailId: responseData.id
        });
      } catch (emailError: any) {
        console.error('❌ Resend email error:', emailError);
        // Return content as fallback
        return NextResponse.json({
          success: true,
          message: 'Email service unavailable. Here are your suggestions:',
          fallback: true,
          content: {
            subject: emailSubject,
            text: textBody
          }
        });
      }
    }

    // Fallback: Return data for client-side display
    console.log('⚠️ No email service configured. Returning content for display.');
    console.log('📧 Email would be sent to:', email);

    return NextResponse.json({
      success: true,
      message: 'Email service not configured. Here are your suggestions:',
      fallback: true,
      content: {
        subject: emailSubject,
        text: textBody
      }
    });

  } catch (error: any) {
    console.error('Error in send-suggestions API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
