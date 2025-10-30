import { Helmet } from 'react-helmet-async';
import profileData from '@/data/profile.json';
import contentData from '@/data/content.json';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const SEO = ({ title, description, keywords, image }: SEOProps = {}) => {
  const { personalInfo, seo } = profileData;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kiruthika-kuppusaamy.com';
  const profileImage = image || `${baseUrl}${personalInfo.photo}`;
  
  const pageTitle = title || contentData.seo.title;
  const pageDescription = description || contentData.seo.description;
  const pageKeywords = keywords || contentData.seo.keywords;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personalInfo.name,
    "jobTitle": personalInfo.designation,
    "affiliation": {
      "@type": "Organization",
      "name": personalInfo.institution,
      "department": personalInfo.department
    },
    "description": personalInfo.tagline,
    "image": profileImage,
    "url": baseUrl,
    "email": personalInfo.email,
    "telephone": personalInfo.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": personalInfo.location,
      "addressCountry": "India"
    },
    "alumniOf": profileData.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    })),
    "knowsAbout": contentData.about.specialization,
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Professor",
      "yearsInOccupation": 18
    },
    "sameAs": Object.values(profileData.socialLinks || {}).filter(Boolean)
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={personalInfo.name} />
      <link rel="canonical" href={baseUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={profileImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={personalInfo.name} />
      <meta property="og:locale" content="en_US" />
      <meta property="profile:first_name" content={personalInfo.name.split(' ')[0]} />
      <meta property="profile:last_name" content={personalInfo.name.split(' ')[1]} />
      <meta property="profile:username" content={personalInfo.name.replace(/\s+/g, '').toLowerCase()} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={baseUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={profileImage} />
      <meta name="twitter:creator" content={personalInfo.name} />
      <meta name="twitter:site" content={personalInfo.name} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#2563eb" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content={pageTitle} />
      <meta name="DC.creator" content={personalInfo.name} />
      <meta name="DC.description" content={pageDescription} />
      <meta name="DC.date" content={contentData.site.lastUpdated} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Preload critical resources */}
      <link rel="preload" href={personalInfo.photo} as="image" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Helmet>
  );
};