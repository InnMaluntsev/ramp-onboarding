import LabPage from "@/app/components/LabPage";
import { labsConfig } from "@/config";

type Props = {
  params: {
    slug: string;
  };
};

export default function Lab({ params }: Props) {
  return <LabPage labSlug={params.slug} />;
}

// Generate static params for all available labs
export async function generateStaticParams() {
  // Get lab slugs from your actual config
  const labSlugs = Object.keys(labsConfig);
  
  return labSlugs.map((slug) => ({
    slug: slug,
  }));
}