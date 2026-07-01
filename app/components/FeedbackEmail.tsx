import * as React from 'react';

interface FeedbackEmailProps {
  name?: string;
  email: string;
  issueType: string;
  pageUrl?: string;
  message: string;
  baseUrl?: string;
}

export const FeedbackEmail = ({
  name = 'Anonymous',
  email = 'user@example.com',
  issueType = 'Bug / Issue',
  pageUrl = 'Not specified',
  message = 'Something went wrong.',
  baseUrl = 'https://www.showerhaus.co.za',
}: FeedbackEmailProps) => {
  const previewText = `Webmaster Feedback: ${issueType}`;

  return (
    <html lang="en">
      <head>
        <title>{previewText}</title>
      </head>
      <body style={main}>
        <div style={container}>
          <div style={logoContainer}>
            <img
              src={`${baseUrl}/logo.png`}
              width="200"
              alt="Shower Haus Logo"
              style={logo}
            />
          </div>
          
          <h1 style={heading}>Webmaster Feedback Submission</h1>
          <p style={paragraph}>
            A user has submitted feedback regarding the new website.
          </p>

          <div style={detailsContainer}>
            <p style={detailRow}>
              <strong>Name:</strong> {name || 'Anonymous'}
            </p>
            <p style={detailRow}>
              <strong>Email:</strong> <a href={`mailto:${email}`} style={link}>{email}</a>
            </p>
            <p style={detailRow}>
              <strong>Feedback Type:</strong> {issueType}
            </p>
            <p style={detailRow}>
              <strong>Page URL:</strong> {pageUrl}
            </p>
          </div>

          <hr style={hr} />

          <div>
            <p style={subheading}>Message / Description:</p>
            <p style={messageText}>{message}</p>
          </div>

          <hr style={hr} />
          
          <p style={footer}>
            This email was sent automatically from the Shower Haus website feedback form.
          </p>
        </div>
      </body>
    </html>
  );
};

export default FeedbackEmail;

// Styles matching website branding
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '"Montserrat", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  width: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginTop: '40px',
  marginBottom: '40px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  color: '#14294f',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '0',
  margin: '0 0 20px 0',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4b5563',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const detailsContainer = {
  backgroundColor: '#fafafa',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '24px',
};

const detailRow = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '4px 0',
};

const subheading = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#14294f',
  marginBottom: '12px',
};

const messageText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#374151',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const link = {
  color: '#4A89C8',
  textDecoration: 'underline',
};

const footer = {
  fontSize: '12px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  marginTop: '20px',
};
