import {
  getPlatformById,
  getPlatforms,
  getSocialLinksById,
} from "./_services/data-services";

export default async function Home() {
  const platforms = await getPlatforms();
  console.log("🚀 ~ Home ~ platforms:", platforms);

  const socialLinks = await getSocialLinksById(7);
  console.log("🚀 ~ Home ~ socialLinks:", socialLinks);

  const platform = await getPlatformById(19);
  console.log("🚀 ~ Home ~ platform:", platform);

  return <div className="">Home</div>;
}
