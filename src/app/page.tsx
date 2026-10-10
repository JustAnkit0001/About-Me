import { UniverseScene } from "@/components/universe-scene";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <main id="content" className="nova-page">
        <UniverseScene />
      </main>
    </>
  );
}
