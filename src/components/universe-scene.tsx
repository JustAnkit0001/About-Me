"use client";

import { ArrowRight, Compass, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";

import { portfolio, type PlanetId, type PortfolioData } from "@/data/portfolio";

type ThreeUniverseProps = { selectedPlanet: PlanetId; portfolioData: PortfolioData };

const planetPositions: Record<PlanetId, THREE.Vector3> = {
  origin: new THREE.Vector3(0, 0, 0),
  genesis: new THREE.Vector3(4.25, 1.65, -1.7),
  technology: new THREE.Vector3(-4.2, -1.55, -1.2),
  "project-galaxy": new THREE.Vector3(3.35, -2.65, -3.1),
  contact: new THREE.Vector3(-2.25, 3.05, -3.8),
};

const planetRadii: Record<PlanetId, number> = {
  origin: 1.78,
  genesis: 0.92,
  technology: 0.86,
  "project-galaxy": 1.04,
  contact: 0.82,
};

const planetColors: Record<PlanetId, [string, string]> = {
  origin: ["#547ea8", "#0b1828"],
  genesis: ["#9e6e50", "#21151d"],
  technology: ["#6359ba", "#111638"],
  "project-galaxy": ["#52a9a1", "#0b2a2c"],
  contact: ["#bc6e9d", "#291624"],
};

function createStars(count: number, spread: number, size: number, opacity: number) {
  const positions = new Float32Array(count * 3);
  let seed = count * 17 + spread;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let index = 0; index < count; index += 1) {
    const radius = spread * (0.35 + random() * 0.65);
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi);
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xb9d7ff,
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}

function createPlanet(id: PlanetId, radius: number) {
  const [light, dark] = planetColors[id];
  const planetType = id === "origin" ? 0 : id === "genesis" ? 1 : id === "technology" ? 2 : id === "project-galaxy" ? 3 : 4;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLight: { value: new THREE.Color(light) },
      uDark: { value: new THREE.Color(dark) },
      uSeed: { value: id.length * 0.71 },
      uPlanetType: { value: planetType },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uLight;
      uniform vec3 uDark;
      uniform float uSeed;
      uniform float uPlanetType;
      varying vec3 vNormal;
      varying vec3 vPosition;
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(.1, .2, .3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += noise(p) * amplitude;
          p = p * 2.03 + 13.7;
          amplitude *= 0.5;
        }
        return value;
      }
      void main() {
        vec3 samplePoint = vPosition * 2.3 + vec3(uSeed, 0.0, uSeed * .37);
        float continental = fbm(samplePoint);
        float detail = fbm(vPosition * 10.0 + uSeed * 2.0);
        float micro = noise(vPosition * 26.0 + uSeed);
        float bands = sin(vPosition.y * 15.0 + continental * 2.4) * .5 + .5;
        vec3 base = mix(uDark, uLight, smoothstep(.25, .72, continental));

        if (uPlanetType < 0.5) {
          float ocean = smoothstep(.47, .56, continental);
          vec3 land = mix(vec3(.10,.20,.26), vec3(.38,.46,.32), smoothstep(.48,.72,detail));
          vec3 water = mix(vec3(.015,.06,.11), vec3(.06,.22,.31), detail);
          base = mix(water, land, ocean);
          base += vec3(.16,.12,.06) * pow(max(detail - .63, 0.0) * 2.5, 2.0);
        } else if (uPlanetType > 2.5 && uPlanetType < 3.5) {
          base = mix(base, vec3(.12,.38,.35), smoothstep(.35,.75,bands));
        } else if (uPlanetType > 1.5 && uPlanetType < 2.5) {
          base = mix(base, vec3(.22,.18,.52), smoothstep(.22,.72,detail));
        } else {
          base = mix(base, base * 1.25, smoothstep(.3,.8,bands));
        }

        base += (micro - .5) * .08;
        vec3 lightDirection = normalize(vec3(-.68, .42, .92));
        vec3 normal = normalize(vNormal);
        float light = max(dot(normal, lightDirection), 0.0);
        float diffuse = smoothstep(-.08, .32, dot(normal, lightDirection));
        vec3 viewDirection = normalize(-vPosition);
        vec3 halfDirection = normalize(lightDirection + viewDirection);
        float specular = pow(max(dot(normal, halfDirection), 0.0), 42.0) * (uPlanetType < .5 ? .8 : .12);
        float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.6);
        float nightDetail = (1.0 - diffuse) * smoothstep(.54, .76, detail) * (uPlanetType < .5 ? .16 : .035);
        vec3 color = base * (.02 + diffuse * .98) + vec3(.34,.52,.72) * rim * .34 + vec3(.9,.96,1.0) * specular * light;
        color += vec3(1.0, .48, .16) * nightDetail;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), material);
}

function createCloudLayer(radius: number) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.012, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        float hash(vec3 p) {
          p = fract(p * .3183099 + vec3(.1,.2,.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
        }
        void main() {
          float cloud = noise(vPosition * 5.0 + vec3(uTime * .006, 0.0, 0.0));
          cloud += noise(vPosition * 11.0 + 4.0) * .42;
          float light = max(dot(normalize(vNormal), normalize(vec3(-.68,.42,.92))), 0.0);
          float horizon = pow(1.0 - max(dot(normalize(vNormal), vec3(0,0,1)), 0.0), 2.0);
          float alpha = smoothstep(.57, .78, cloud) * (.04 + light * .27) + horizon * .025;
          gl_FragColor = vec4(vec3(.78,.86,.9), alpha);
        }
      `,
    }),
  );
}

function ThreeUniverse({ selectedPlanet, portfolioData }: ThreeUniverseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedPlanet);
  useEffect(() => {
    selectedRef.current = selectedPlanet;
  }, [selectedPlanet]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050b, 0.012);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 12);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x02050b, 1);
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    world.add(createStars(900, 42, 0.045, 0.72));
    world.add(createStars(380, 28, 0.075, 0.45));
    world.add(createStars(110, 18, 0.11, 0.32));

    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(18, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader: `uniform float uTime; varying vec3 vPos; void main(){float n=sin(vPos.x*.18+uTime*.02)*sin(vPos.y*.24)+sin(vPos.z*.13); vec3 c=mix(vec3(.03,.04,.12),vec3(.12,.04,.18),smoothstep(-.7,.8,n)); gl_FragColor=vec4(c,.16);}`,
      }),
    );
    world.add(nebula);

    const objects = new Map<PlanetId, THREE.Object3D>();
    portfolioData.planets.forEach((planet, index) => {
      const radius = planetRadii[planet.id];
      const mesh = createPlanet(planet.id, radius);
      mesh.position.copy(planetPositions[planet.id]);
      mesh.rotation.y = index * 0.7;
      objects.set(planet.id, mesh);
      world.add(mesh);
      if (planet.id === "origin") {
        const clouds = createCloudLayer(radius);
        mesh.add(clouds);
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.035, 48, 32),
          new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: { value: new THREE.Color(0x4d9ed6) } },
            vertexShader: `varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
            fragmentShader: `uniform vec3 uColor; varying vec3 vNormal; void main(){float rim=pow(1.0-max(dot(normalize(vNormal),vec3(0,0,1)),0.0),3.2); gl_FragColor=vec4(uColor,rim*.42);}`,
          }),
        );
        mesh.add(atmosphere);
      }
    });

    const ambient = new THREE.HemisphereLight(0x536b9c, 0x02030a, 0.3);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xc5e2ff, 2.4);
    key.position.set(-7, 5, 9);
    scene.add(key);

    const startTime = performance.now();
    const currentCamera = new THREE.Vector3(0, 0.2, 12);
    const lookAt = new THREE.Vector3();
    let frame = 0;
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      frame = requestAnimationFrame(animate);
      objects.forEach((object, id) => {
        object.rotation.y += id === "origin" ? 0.0009 : 0.0018;
        const material = (object as THREE.Mesh).material as THREE.ShaderMaterial;
        if (material.uniforms) material.uniforms.uTime.value = elapsed;
        if (id === "origin") {
          const cloudLayer = object.children.find((child) => child instanceof THREE.Mesh && child !== object.children[object.children.length - 1]);
          if (cloudLayer instanceof THREE.Mesh) {
            const cloudMaterial = cloudLayer.material as THREE.ShaderMaterial;
            if (cloudMaterial.uniforms) cloudMaterial.uniforms.uTime.value = elapsed;
            cloudLayer.rotation.y += 0.0012;
          }
        }
      });
      const activePlanet = selectedRef.current;
      const selectedPosition = planetPositions[activePlanet];
      const desired = activePlanet === "origin"
        ? new THREE.Vector3(0, 0.2, 12)
        : new THREE.Vector3(selectedPosition.x * 0.25, selectedPosition.y * 0.25, 9.4);
      currentCamera.lerp(desired, 0.035);
      camera.position.copy(currentCamera);
      lookAt.lerp(selectedPosition, 0.035);
      camera.lookAt(lookAt);
      (nebula.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    };
  }, [portfolioData]);

  return <div ref={mountRef} className="three-universe" aria-hidden="true" />;
}

export function UniverseScene() {
  const [portfolioData, setPortfolioData] = useState(portfolio);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>(portfolio.planets[0].id);
  const [isPortfolioLayerVisible, setIsPortfolioLayerVisible] = useState(false);
  const selected = useMemo(
    () => portfolioData.planets.find((planet) => planet.id === selectedPlanet) ?? portfolioData.planets[0],
    [portfolioData, selectedPlanet],
  );

  useEffect(() => {
    const applySavedPortfolio = (saved: string | null) => {
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved) as PortfolioData;
      const contactDetails = portfolio.planets.find((planet) => planet.id === "contact")?.details ?? [];
      const planets = parsed.planets.map((planet) =>
        planet.id === "contact" ? { ...planet, details: contactDetails } : planet,
      );
      const migrated = { ...parsed, siteName: portfolio.siteName, planets, socialLinks: portfolio.socialLinks };
      window.localStorage.setItem("nova-portfolio-data", JSON.stringify(migrated));
        setPortfolioData(migrated);
      } catch {
        window.localStorage.removeItem("nova-portfolio-data");
      }
    };

    applySavedPortfolio(window.localStorage.getItem("nova-portfolio-data"));
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "nova-portfolio-data") applySavedPortfolio(event.newValue);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const selectPlanet = (planetId: PlanetId) => {
    setSelectedPlanet(planetId);
    setIsPortfolioLayerVisible(true);
  };

  return (
    <section className={isPortfolioLayerVisible ? "nova-shell has-portfolio-layer" : "nova-shell is-universe-only"} aria-label="Personal portfolio universe">
      {isPortfolioLayerVisible ? (
      <header className="nova-header page-width">
        <div className="brand-lockup" aria-label="Personal portfolio brand">
          <span className="brand-mark">N</span>
          <span>{portfolioData.siteName}</span>
        </div>
        <nav className="planet-nav" aria-label="Planet destinations">
          {portfolioData.planets.map((planet) => (
            <button key={planet.id} type="button" className={selectedPlanet === planet.id ? "nav-pill is-active" : "nav-pill"} aria-pressed={selectedPlanet === planet.id} onClick={() => selectPlanet(planet.id)}>
              {planet.shortName}
            </button>
          ))}
        </nav>
        <button type="button" className="meta-button" onClick={() => setIsPortfolioLayerVisible(false)}>Return to universe</button>
      </header>
      ) : null}

      <div className={isPortfolioLayerVisible ? "page-width nova-experience" : "nova-experience"}>
        <div className="universe-stage" aria-live="polite">
          <ThreeUniverse selectedPlanet={selectedPlanet} portfolioData={portfolioData} />
          <div className="scene-vignette" aria-hidden="true" />
          {portfolioData.planets.map((planet) => {
            const isSelected = isPortfolioLayerVisible && selectedPlanet === planet.id;
            const hitSize =
              planet.id === "origin"
                ? "clamp(15rem, 22vw, 23rem)"
                : planet.id === "project-galaxy"
                  ? "clamp(5rem, 7.4vw, 7.5rem)"
                  : "clamp(6rem, 9.5vw, 9rem)";
            const planetStyle = {
              "--planet-x": `${planet.orbitX}%`,
              "--planet-y": `${planet.orbitY}%`,
              "--planet-hit-size": hitSize,
            } as CSSProperties;
            return (
              <button key={planet.id} type="button" className={isSelected ? "planet-button is-selected" : "planet-button"} style={planetStyle} aria-label={`Explore ${planet.name}`} aria-pressed={isSelected} onClick={() => selectPlanet(planet.id)}>
              </button>
            );
          })}
          {!isPortfolioLayerVisible ? (
            <nav className="scene-index" aria-label="Portfolio destinations">
              <span className="scene-index-title">Portfolio index</span>
              {portfolioData.planets.map((planet) => (
                <div
                  key={planet.id}
                  className="scene-index-item"
                >
                  <span className={`scene-index-planet scene-index-planet-${planet.id}`} aria-hidden="true" />
                  {planet.shortName}
                </div>
              ))}
            </nav>
          ) : null}
          {isPortfolioLayerVisible ? <div className="scene-guide" aria-label="Scene controls guide"><Compass aria-hidden="true" /><span>Navigate by destination · cinematic focus</span></div> : null}
        </div>

        {isPortfolioLayerVisible ? <aside className="planet-panel" aria-live="polite">
          <p className="panel-kicker">DESTINATION // {selected.tag}</p>
          <h2>{selected.name}</h2>
          <p className="panel-summary">{selected.summary}</p>
          <ul className="detail-list">{selected.details.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="panel-actions">
            <button type="button" className="primary-button" onClick={() => selectPlanet("project-galaxy")}>View selected work <ArrowRight aria-hidden="true" /></button>
            <button type="button" className="secondary-button" onClick={() => selectPlanet("contact")}>Professional contact</button>
          </div>
          {selected.id === "contact" ? (
            <div className="contact-list" aria-label="Contact links">
              {portfolioData.socialLinks.map((link) => (
                <a key={link.title} className="contact-link" href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                  <span>{link.title}</span>
                  <ExternalLink aria-hidden="true" size={14} />
                </a>
              ))}
            </div>
          ) : null}
        </aside> : null}
      </div>
    </section>
  );
}

export default UniverseScene;
