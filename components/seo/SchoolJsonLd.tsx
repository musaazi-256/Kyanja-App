export default function SchoolJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Kyanja Junior School',
    alternateName: ['KJS', 'Kyanja Junior', 'Kyanja School'],
    url: 'https://www.kyanjajuniorschool.com',
    logo: 'https://www.kyanjajuniorschool.com/logo.svg',
    description:
      'Kyanja Junior School is a leading nursery and primary school located in Kyanja, Kisaasi area, Nakawa Division, Kampala, Uganda. We offer quality education from nursery through Primary Seven (P7) in a safe and nurturing environment.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 43a, Katumba Zone, 500m from Kyanja West Mall',
      addressLocality: 'Kyanja',
      addressRegion: 'Nakawa Division, Kampala',
      addressCountry: 'UG',
    },
    telephone: ['+256772493267', '+256702860382', '+256792171850'],
    email: 'admin@kjsch.com',
    sameAs: [
      'https://www.kyanjajuniorschool.com',
      'https://kanjajuniorschool.com',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Educational Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Nursery Education',
            description: 'Early childhood education at Kyanja Junior School.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Primary Education (P1–P7)',
            description:
              'Complete primary school curriculum from Primary One to Primary Seven, Kyanja, Kampala.',
          },
        },
      ],
    },
    location: {
      '@type': 'Place',
      name: 'Kyanja Junior School',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 43a, Katumba Zone',
        addressLocality: 'Kyanja',
        addressRegion: 'Nakawa Division, Kampala',
        addressCountry: 'UG',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
