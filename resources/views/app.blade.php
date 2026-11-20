{{-- <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Inscriptions of Nepal - Official Website') }}</title>
        <link rel="icon" href='/images/new2.png'type='image/png'>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

         <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Forum&family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jost:ital,wght@0,100..900;1,100..900&family=PT+Mono&display=swap"
    rel="stylesheet">


         <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RQ132ERF68"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-RQ132ERF68');
  </script>

    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html> --}}


<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Inscriptions of Nepal - Official Website') }}</title>

    <!-- Primary Meta Tags -->
    <meta name="description" inertia="description"
        content="Inscriptions of Nepal documents and studies Nepal’s ancient written records found on monuments, temples, monasteries, and historic sites, preserving endangered inscriptions." />
    <meta name="keywords"
        content="Nepal cultural heritage, Nepalese manuscripts, historical artefacts Nepal, Nepal research papers, heritage preservation, Nepalese history" />
    <meta name="author" content="Inscriptions of Nepal" />
    <meta name="robots" content="index, follow" />

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/images/new2.png" />
    <link rel="apple-touch-icon" href="/images/new2.png" />

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" inertia="og:title" content="Inscriptions of Nepal" />
    <meta property="og:description" inertia="og:description"
        content="Explore Nepal’s ancient inscriptions found on monuments, temples, monasteries, and historic sites." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:image" inertia="og:image" content="https://nepalinscription.com/images/new2.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Inscriptions of Nepal" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" inertia="twitter:title" content="Inscriptions of Nepal" />
    <meta name="twitter:description" inertia="twitter:description"
        content="Discover and explore Nepal's rich written cultural heritage including ancient manuscripts, artefacts, and research articles." />
    <meta name="twitter:image" inertia="twitter:image" content="https://nepalinscription.com/images/new2.png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Forum&family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jost:ital,wght@0,100..900;1,100..900&family=PT+Mono&display=swap"
        rel="stylesheet">

    <!-- Organization Schema -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "Organization",
        "name": "Inscriptions of Nepal",
        "url": "https://nepalinscription.com/",
        "logo": "https://nepalinscription.com/images/new2.png",
        "description": "Organization dedicated to preserving and documenting Nepal's written cultural heritage",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kathmandu",
            "addressRegion": "Bagmati",
            "addressCountry": "Nepal"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "info@nepalinscription.com",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://www.facebook.com/writtenculturalheritageofnepal",
            "https://www.instagram.com/writtenculturalheritageofnepal/",
            "https://www.youtube.com/@WrittenCulturalHeritage"
        ]
    }
    </script>

    <!-- Website Schema -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Inscriptions of Nepal",
        "url": "https://nepalinscription.com/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://nepalinscription.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-RQ132ERF68"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-RQ132ERF68');
    </script>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <noscript>
        <div style="text-align:center; padding:2rem; font-family:sans-serif;">
            <h1>Inscriptions of Nepal</h1>
            <p>This website requires JavaScript to function properly. Please enable JavaScript.</p>
            <p>Contact us at: info@nepalinscription.com</p>
        </div>
    </noscript>
</body>

</html>
