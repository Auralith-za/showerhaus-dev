import * as React from 'react';

interface BespokeEmailProps {
  style: string;
  layout: string;
  width: string;
  length: string;
  height: string;
  finish: string;
  material: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  baseUrl?: string;
}

export const BespokeEmail = ({
  style,
  layout,
  width,
  length,
  height,
  finish,
  material,
  firstName,
  lastName,
  email,
  phone,
  notes,
  baseUrl = 'https://www.showerhaus.co.za',
}: BespokeEmailProps) => {
  const previewText = `New Custom-made Shower Request from ${firstName} ${lastName}`;

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
          
          <h1 style={heading}>New Custom-made Request</h1>
          <p style={paragraph}>
            You have received a new custom-made shower request from the configurator.
          </p>

          <div style={section}>
            <h2 style={subheading}>Customer Details</h2>
            <div style={detailsContainer}>
              <p style={detailRow}><strong>Name:</strong> {firstName} {lastName}</p>
              <p style={detailRow}><strong>Email:</strong> <a href={`mailto:${email}`} style={link}>{email}</a></p>
              <p style={detailRow}><strong>Phone:</strong> {phone || 'Not provided'}</p>
            </div>
          </div>

          <div style={section}>
            <h2 style={subheading}>Configuration Details</h2>
            <div style={detailsContainer}>
              <p style={detailRow}><strong>Style:</strong> {style || 'Not selected'}</p>
              <p style={detailRow}><strong>Layout/Configuration:</strong> {layout || 'Not selected'}</p>
              <p style={detailRow}><strong>Dimensions:</strong> {width}mm (W) x {length}mm (L) x {height}mm (H)</p>
              <p style={detailRow}><strong>Hardware Finish:</strong> {finish || 'Not selected'}</p>
              <p style={detailRow}><strong>Hardware Material:</strong> {material || 'Not selected'}</p>
            </div>
          </div>

          {notes && (
            <div style={section}>
              <h2 style={subheading}>Notes / Special Requirements</h2>
              <div style={detailsContainer}>
                <p style={messageText}>{notes}</p>
              </div>
            </div>
          )}

          <hr style={hr} />
          
          <p style={footer}>
            This email was sent automatically from the Shower Haus custom-made configurator.
          </p>
        </div>
      </body>
    </html>
  );
};

export default BespokeEmail;

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

const section = {
  marginBottom: '24px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#14294f',
  marginBottom: '12px',
  marginTop: '0',
};

const detailsContainer = {
  backgroundColor: '#fafafa',
  padding: '20px',
  borderRadius: '6px',
};

const detailRow = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '6px 0',
};

const messageText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#374151',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
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
