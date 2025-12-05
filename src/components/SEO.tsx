import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export const SEO = ({ 
  title = 'Samuel Calvert - Infrastructure Engineer',
  description = 'Computer Engineering professional specializing in infrastructure automation, networking, and systems troubleshooting.',
  keywords = ['infrastructure', 'DevOps', 'Kubernetes', 'cloud', 'engineering'],
  image = '/og-image.png',
  url = 'https://samuelcalvert.com'
}: SEOProps) => {
  const siteTitle = title === 'Samuel Calvert - Infrastructure Engineer' 
    ? title 
    : `${title} | Samuel Calvert`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Samuel Calvert",
          "jobTitle": "Infrastructure Engineer",
          "url": url,
          "sameAs": [
            "https://github.com/sfcal",
            "https://linkedin.com/in/samuel-f-calvert"
          ]
        })}
      </script>
    </Helmet>
  );
};