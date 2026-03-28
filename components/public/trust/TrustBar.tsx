import { Clock, MapPin, Phone, Award } from "lucide-react";

const ITEMS = [
  {
    icon: Clock,
    label: "School Hours",
    value: "Mon – Fri  ·  7:30 AM – 5:00 PM",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Plot 43a Katumba Zone, Nakawa, Kampala",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+256 772 493 267",
    href: "tel:+256772493267",
  },
  {
    icon: Award,
    label: "Curriculum",
    value: "Uganda National Curriculum (UNEB)",
  },
];

export default function TrustBar() {
  return (
    <div
      className="px-4 py-4 border-b"
      style={{
        backgroundColor: "var(--brand-ice)",
        borderColor: "rgba(0,0,153,0.08)",
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
        {ITEMS.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(0,0,153,0.08)" }}
            >
              <Icon className="w-4 h-4" style={{ color: "var(--brand-navy)" }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: "var(--brand-navy)", opacity: 0.5 }}
              >
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-xs font-semibold truncate block hover:underline"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {value}
                </a>
              ) : (
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
