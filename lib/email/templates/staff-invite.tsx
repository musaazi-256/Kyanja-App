import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

interface StaffInviteEmailProps {
  fullName: string;
  role: string;
  inviteUrl: string;
  invitedBy?: string;
  schoolUrl?: string;
}

export function StaffInviteEmail({
  fullName,
  role,
  inviteUrl,
  invitedBy = "The Administration",
  schoolUrl = "https://www.kyanjajuniorschool.com",
}: StaffInviteEmailProps) {
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Html>
      <Head />
      <Preview>
        You have been invited to join the Kyanja Junior School staff portal
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.schoolName}>Kyanja Junior School</Heading>
            <Text style={styles.tagline}>Staff Portal Invitation</Text>
          </Section>

          {/* Body */}
          <Section style={styles.content}>
            <Heading as="h2" style={styles.heading}>
              Welcome, {fullName}
            </Heading>

            <Text style={styles.text}>
              {invitedBy} has invited you to join the{" "}
              <strong>Kyanja Junior School Staff Portal</strong> as a{" "}
              <strong>{displayRole}</strong>.
            </Text>

            <Text style={styles.text}>
              Click the button below to set your password and activate your
              account. This invitation link is valid for{" "}
              <strong>24 hours</strong>.
            </Text>

            <Section style={styles.buttonWrapper}>
              <Button href={inviteUrl} style={styles.button}>
                Accept Invitation &amp; Set Password
              </Button>
            </Section>

            <Text style={styles.hint}>
              If the button above does not work, copy and paste this link into
              your browser:
            </Text>
            <Text style={styles.linkText}>{inviteUrl}</Text>

            <Hr style={styles.divider} />

            <Text style={styles.text}>
              Once your account is active you will be able to:
            </Text>
            <Text style={styles.listItem}>
              • View and manage student applications
            </Text>
            <Text style={styles.listItem}>
              • Access school schedules and calendar events
            </Text>
            <Text style={styles.listItem}>
              • Communicate with parents via the newsletter
            </Text>
            <Text style={styles.listItem}>
              • Manage the school media library
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footer}>
              If you were not expecting this invitation, please ignore this
              email or contact us at{" "}
              <a href="mailto:admin@kjsch.com" style={styles.link}>
                admin@kjsch.com
              </a>
              .
            </Text>

            <Text style={styles.footer}>
              Warm regards,
              <br />
              <strong>Kyanja Junior School</strong>
              <br />
              500M from West Mall, Kyanja · Plot 43a Katumba Zone, Nakawa
              <br />
              +256 772 493 267 &nbsp;|&nbsp;
              <a href={schoolUrl} style={styles.link}>
                {schoolUrl.replace("https://", "")}
              </a>
            </Text>
          </Section>

          {/* Footer strip */}
          <Section style={styles.footerStrip}>
            <Text style={styles.footerStripText}>
              © {new Date().getFullYear()} Kyanja Junior School · All rights
              reserved
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#1e3a5f",
    padding: "28px 32px",
    textAlign: "center" as const,
  },
  schoolName: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
  },
  tagline: {
    color: "#93c5fd",
    fontSize: "13px",
    margin: 0,
    letterSpacing: "0.5px",
  },
  content: { padding: "36px 32px 28px" },
  heading: { color: "#1e3a5f", fontSize: "22px", margin: "0 0 20px 0" },
  text: {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px 0",
  },
  buttonWrapper: { textAlign: "center" as const, margin: "28px 0" },
  button: {
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "bold",
    display: "inline-block",
  },
  hint: { color: "#6b7280", fontSize: "13px", margin: "0 0 6px 0" },
  linkText: {
    color: "#1e3a5f",
    fontSize: "12px",
    wordBreak: "break-all" as const,
    margin: "0 0 24px 0",
  },
  listItem: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 4px 0",
    paddingLeft: "4px",
  },
  divider: { borderColor: "#e5e7eb", margin: "24px 0" },
  footer: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0 0 12px 0",
  },
  link: { color: "#1e3a5f" },
  footerStrip: {
    backgroundColor: "#1e3a5f",
    padding: "14px 32px",
    textAlign: "center" as const,
  },
  footerStripText: { color: "#93c5fd", fontSize: "12px", margin: 0 },
};
