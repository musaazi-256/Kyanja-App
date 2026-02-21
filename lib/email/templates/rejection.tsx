import {
  Html, Head, Body, Container, Section,
  Heading, Text, Hr, Preview,
} from '@react-email/components'

interface RejectionEmailProps {
  parentName: string
  studentName: string
  className: string
  academicYear: string
}

export function RejectionEmail({
  parentName,
  studentName,
  className,
  academicYear,
}: RejectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update on {studentName}&apos;s application to Kyanja Junior School</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.schoolName}>Kyanja Junior School</Heading>
          </Section>

          <Section style={styles.content}>
            <Heading as="h2" style={styles.heading}>
              Application Update
            </Heading>

            <Text style={styles.text}>Dear {parentName},</Text>

            <Text style={styles.text}>
              Thank you for your interest in enrolling{' '}
              <strong>{studentName}</strong> in <strong>{className}</strong> for
              the <strong>{academicYear}</strong> academic year at Kyanja Junior School.
            </Text>

            <Text style={styles.text}>
              After careful consideration, we regret to inform you that we are unable
              to offer a place at this time. This decision was difficult due to the high
              volume of applications we received.
            </Text>

            <Text style={styles.text}>
              We encourage you to apply again in the next academic year. If you would
              like further information or wish to be placed on our waiting list, please
              do not hesitate to contact us.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              Contact us: <a href="mailto:admin@kjsch.com">admin@kjsch.com</a>
            </Text>

            <Text style={styles.footer}>
              With respect,
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
  divider:    { borderColor: '#e5e7eb', margin: '24px 0' },
  footer:     { color: '#6b7280', fontSize: '14px', lineHeight: '20px' },
}
