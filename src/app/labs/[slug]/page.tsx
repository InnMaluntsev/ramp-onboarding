import LabPage from "@/app/components/LabPage";

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
  // You can import this from config if needed
  const labSlugs = [
    "network-link-v2",
    "off-exchange", 
    "embedded-wallets",
    "web3-workshop"
    ];
  
  return labSlugs.map((slug) => ({
    slug: slug,
  }));
}