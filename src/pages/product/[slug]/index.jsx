import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const ProductDescriptionPage = dynamic(
  () => import("@/components/pagecomponents/ProductDescriptionPage"),
  { ssr: false },
);
import MetaData from "@/components/metadata-component/MetaData";
import axios from "axios";
import { extractJSONFromMarkup } from "@/utils/helperFunction";

let serverSidePropsFunction = null;

if (process.env.NEXT_PUBLIC_SEO == "true") {
  serverSidePropsFunction = async (context) => {
    const { slug } = context.params || {};
    const lang = context.query?.lang || "fr";
    let isMetadata = false;
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE || "Soukday";
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION || "";
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS || "";
    let schemaMarkup = null;
    let og_image = null;
    let favicon = null;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/products/get_seo_things`,
        {
          params: {
            slug: slug,
          },
          headers: {
            "Content-Language": lang,
          },
        },
      );

      if (
        response.data?.data?.meta_title != null &&
        response.data?.data?.meta_description != null &&
        response.data?.data?.meta_keywords != null
      ) {
        isMetadata = true;
      }

      if (isMetadata) {
        const seoData = response.data.data;
        metatitle = seoData?.meta_title || metatitle;
        metaDescription = seoData?.meta_description || metaDescription;
        metaKeywords = seoData?.meta_keywords || metaKeywords;
        og_image = seoData?.og_image || null;
        favicon = seoData?.favicon || null;
        if (seoData?.schema_markup) {
          schemaMarkup = extractJSONFromMarkup(seoData?.schema_markup);
        }
      }
    } catch (error) {
      console.warn("Product SEO fetch error:", error?.message || error);
    }

    return {
      props: {
        slug: slug || "",
        title: metatitle,
        description: metaDescription,
        keywords: metaKeywords,
        og_image,
        schemaMarkup: schemaMarkup ? JSON.stringify(schemaMarkup) : null,
        favicon: favicon ? favicon : null,
      },
    };
  };
}

export const getServerSideProps = serverSidePropsFunction;

export default function Index(props = {}) {
  const router = useRouter();
  const slug = props.slug || router.query?.slug || "";
  const title = props.title || process.env.NEXT_PUBLIC_META_TITLE || "Soukday";
  const description = props.description || process.env.NEXT_PUBLIC_META_DESCRIPTION || "";
  const keywords = props.keywords || process.env.NEXT_PUBLIC_META_KEYWORDS || "";
  const og_image = props.og_image || null;
  const schemaMarkup = props.schemaMarkup || null;
  const favicon = props.favicon || null;

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`;
  return (
    <>
      <MetaData
        pageName="/product/"
        title={title}
        description={description}
        keywords={keywords}
        structuredData={schemaMarkup}
        ogUrl={pageUrl}
        ogImage={og_image}
        favicon={favicon}
      />
      <ProductDescriptionPage slug={slug} />
    </>
  );
}
