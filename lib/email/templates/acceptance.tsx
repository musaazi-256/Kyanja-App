import {
  Html, Head, Body, Container, Section,
  Heading, Text, Button, Hr, Preview,
} from '@react-email/components'

interface AcceptanceEmailProps {
  parentName: string
  studentName: string
  className: string
  academicYear: string
  schoolUrl?: string
}

export function AcceptanceEmail({
  parentName,
  studentName,
  className,
  academicYear,
  schoolUrl = 'https://kyanjajunior.ac.ug',
}: AcceptanceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! {studentName}&apos;s application has been accepted.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.schoolName}>Kyanja Junior School</Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.heading}>
              Application Accepted
            </Heading>

            <Text style={styles.text}>Dear {parentName},</Text>

            <Text style={styles.text}>
              We are delighted to inform you that <strong>{studentName}</strong> has been
              officially accepted into <strong>{className}</strong> for the{' '}
              <strong>{academicYear}</strong> academic year at Kyanja Junior School.
            </Text>

            <Text style={styles.text}>
              Please visit our school to complete the enrollment process and collect
              your admission letter. Our office is open Monday – Friday, 8:00 AM – 5:00 PM.
            </Text>

            <Button href={schoolUrl} style={styles.button}>
              Visit Our Website
            </Button>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              If you have any questions, please contact us at{' '}
              <a href="mailto:admin@kjsch.com">admin@kjsch.com</a> or
              call us at +256 772 493 267 / +256 702 860 382 / +256 792 171 850.
            </Text>

            <Text style={styles.footer}>
              Warm regards,
              <br />
              <strong>The Admissions Team</strong>
              <br />
              Kyanja Junior School
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
  button:     {
    backgroundColor: '#1e3a5f', color: '#ffffff', padding: '12px 24px',
    borderRadius: '6px', textDecoration: 'none', display: 'inline-block',
    marginTop: '16px',
  },
  divider:    { borderColor: '#e5e7eb', margin: '24px 0' },
  footer:     { color: '#6b7280', fontSize: '14px', lineHeight: '20px' },
}
