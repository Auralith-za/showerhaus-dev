import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  baseUrl?: string;
}

export const ContactEmail = ({
  firstName = 'John',
  lastName = 'Doe',
  email = 'john@example.com',
  phone = '082 123 4567',
  message = 'I would like a quote for a frameless shower.',
  baseUrl = 'https://www.showerhaus.co.za',
}: ContactEmailProps) => {
  const previewText = `New Enquiry from ${firstName} ${lastName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="200"
              height="auto"
              alt="Shower Haus Logo"
              style={logo}
            />
          </Section>
          
          <Heading style={heading}>New Website Enquiry</Heading>
          <Text style={paragraph}>
            You have received a new message from the contact form on your website.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailRow}>
              <strong>Name:</strong> {firstName} {lastName}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong> <a href={`mailto:${email}`} style={link}>{email}</a>
            </Text>
            <Text style={detailRow}>
              <strong>Phone:</strong> {phone || 'Not provided'}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Text style={subheading}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            This email was sent automatically from the ShowerHaus website contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;

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
