// outsource dependencies
import type { Metadata } from "next";

// local dependencies
import "./globals.css";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { i18n } from "../../../i18n-config";
import { FALLBACK_SEO } from "@/app/[lang]/utils/constants";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { serverFetchApi } from '@/services/request/server-fetch-api';

async function getGlobal (lang: string): Promise<any> {
  // TODO remove it everywhere
  // const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "notificationBanner.link",
      "navbar.links",
      "navbar.navbarLogo.logoImg",
      "footer.footerLogo.logoImg",
      "footer.menuLinks",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.categories",
    ],
    locale: lang,
  };
  return await serverFetchApi('/global', {
    params: urlParamsObject
  });
}

export async function generateMetadata ({ params }: { params: { lang: string } }): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data.attributes;
  const { url } = favicon.data.attributes;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

export default async function RootLayout ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;

  const { notificationBanner, navbar, footer } = global.data.attributes;

  const navbarLogoUrl = getStrapiMedia(
    navbar.navbarLogo.logoImg.data.attributes.url
  );

  const footerLogoUrl = getStrapiMedia(
    footer.footerLogo.logoImg.data.attributes.url
  );

  return <html lang={params.lang}>
    <body className="flex flex-col min-h-screen">
      <Navbar
        links={navbar.links}
        logoUrl={navbarLogoUrl}
        logoText={navbar.navbarLogo.logoText}
      />

      <main className="dark:bg-black dark:text-gray-100 mb-10 flex-grow">{children}</main>

      <Banner data={notificationBanner} />

      <Footer
        logoUrl={footerLogoUrl}
        logoText={footer.footerLogo.logoText}
        menuLinks={footer.menuLinks}
        categoryLinks={footer.categories.data}
        legalLinks={footer.legalLinks}
        socialLinks={footer.socialLinks}
      />
    </body>
  </html>;
}

export async function generateStaticParams () {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
