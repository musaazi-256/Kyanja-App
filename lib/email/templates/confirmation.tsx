import {
  Html, Head, Body, Container, Section,
  Heading, Text, Hr, Preview,
} from '@react-email/components'

interface ConfirmationEmailProps {
  parentName: string
  studentName: string
  className: string
  referenceId: string
}

export function ConfirmationEmail({
  parentName,
  studentName,
  className,
  referenceId,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We received {studentName}&apos;s application — reference #{referenceId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.schoolName}>Kyanja Junior School</Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.heading}>Application Received</Heading>

            <Text style={styles.text}>Dear {parentName},</Text>

            <Text style={styles.text}>
              Thank you for submitting an application for <strong>{studentName}</strong>{' '}
              to join <strong>{className}</strong> at Kyanja Junior School.
            </Text>

            <Text style={styles.text}>
              Your application reference number is:{' '}
              <strong style={{ fontFamily: 'monospace' }}>{referenceId}</strong>
            </Text>

            <Text style={styles.text}>
              Our admissions team will review your application and get back to you
              within 5–10 working days. Please keep this email for your records.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              Questions? Email us at{' '}
              <a href="mailto:admin@kjsch.com">admin@kjsch.com</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body:       { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' },
  container:  { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header:     { backgroundColor: '#1e3a5f', padding: '24px', textAlign: 'center' as const },
  schoolName: { color: '#ffffff', fontSize: '22px', margin: 0 },
  content:    { padding: '32px' },
  heading:    { color: '#1e3a5f', fontSize: '20px', marginBottom: '16px' },
  text:       { color: '#374151', fontSize: '16px', lineHeight: '24px' },
  divider:    { borderColor: '#e5e7eb', margin: '24px 0' },
  footer:     { color: '#6b7280', fontSize: '14px', lineHeight: '20px' },
}
