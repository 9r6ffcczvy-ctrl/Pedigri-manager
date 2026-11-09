'use client';

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Breeder = {
  id: number;
  name: string;
  location: string;
  specialty: string;
  claimed: boolean;
  initials: string;
  color: string;
};

const breeders: Breeder[] = [
  { id: 1, name: "Traba de ejemplo 01", location: "Estados Unidos", specialty: "Cría y genealogía", claimed: true, initials: "01", color: "green" },
  { id: 2, name: "Traba de ejemplo 02", location: "República Dominicana", specialty: "Criador", claimed: false, initials: "02", color: "gold" },
  { id: 3, name: "Traba de ejemplo 03", location: "Puerto Rico", specialty: "Criador y productos", claimed: true, initials: "03", color: "blue" },
];

export default function DirectorioPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Breeder | null>(null);
  const [tab, setTab] = useState("Publicaciones");

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return breeders;
    return breeders.filter((item) =>
      `${item.name} ${item.location} ${item.specialty}`.toLocaleLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/directorio/" aria-label="TRAVERO, inicio">
          <span className={styles.brandMark}>T</span>
          <span>TRAVERO</span>
        </a>
        <nav className={styles.nav}>
          <a className={styles.navActive} href="/directorio/">Directorio</a>
          <a href="/login/">Iniciar sesión</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>DIRECTORIO TRAVERO</p>
          <h1>Encuentra tu comunidad.</h1>
          <p className={styles.heroText}>
            Conoce las trabas, sus publicaciones y sus ejemplares disponibles en un solo lugar.
          </p>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por nombre, país o actividad"
              aria-label="Buscar en el directorio"
            />
          </label>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.artCircle} />
          <div className={styles.artCard}>
            <span className={styles.artLabel}>TRABAS</span>
            <strong>Conectadas<br />por TRAVERO</strong>
            <span className={styles.artLine} />
          </div>
          <span className={styles.artDot} />
        </div>
      </section>

      <section className={styles.directory}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>EXPLORA</p>
            <h2>Directorio de trabas</h2>
          </div>
          <span className={styles.resultCount}>{results.length} páginas</span>
        </div>

        <div className={styles.notice}>
          <span className={styles.noticeIcon}>i</span>
          <p>Maqueta de demostración: los nombres, imágenes y publicaciones reales se añadirán con autorización.</p>
        </div>

        {selected ? (
          <section className={styles.profile}>
            <button className={styles.backButton} onClick={() => setSelected(null)}>← Volver al directorio</button>
            <div className={styles.profileHeader}>
              <div className={`${styles.avatar} ${styles[selected.color]}`}><span>{selected.initials}</span></div>
              <div className={styles.profileIdentity}>
                <div className={styles.profileTitle}>
                  <h2>{selected.name}</h2>
                  <span className={selected.claimed ? styles.claimed : styles.unclaimed}>
                    {selected.claimed ? "Página reclamada" : "Disponible para reclamar"}
                  </span>
                </div>
                <p>{selected.location} <span>·</span> {selected.specialty}</p>
                <p className={styles.profileIntro}>Presentación de la traba y enlaces oficiales. El titular podrá completar y autorizar la información de su página.</p>
                <a className={styles.primaryButton} href="/login/">Entrar / reclamar esta página</a>
              </div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Secciones de la página">
              {["Publicaciones", "Catálogo TRAVERO", "Productos y servicios"].map((item) => (
                <button
                  key={item}
                  className={tab === item ? styles.tabActive : styles.tab}
                  onClick={() => setTab(item)}
                  role="tab"
                  aria-selected={tab === item}
                >
                  {item}
                </button>
              ))}
            </div>

            {tab === "Publicaciones" && (
              <div className={styles.postGrid}>
                {[1, 2, 3].map((post) => (
                  <article className={styles.postCard} key={post}>
                    <div className={styles.postImage}><span>Publicación de muestra</span></div>
                    <div className={styles.postBody}><strong>Publicación autorizada {post}</strong><p>Vista de ejemplo para mostrar cómo aparecería el contenido de la traba.</p></div>
                  </article>
                ))}
              </div>
            )}
            {tab === "Catálogo TRAVERO" && (
              <div className={styles.catalogPlaceholder}>
                <span className={styles.catalogIcon}>T</span>
                <div><strong>Los ejemplares registrados en TRAVERO aparecerán aquí</strong><p>El dueño escogerá cuáles mostrar y qué datos publicar.</p></div>
              </div>
            )}
            {tab === "Productos y servicios" && (
              <div className={styles.catalogPlaceholder}>
                <span className={styles.catalogIcon}>+</span>
                <div><strong>Productos y servicios de la traba</strong><p>Se añadirán manualmente con sus fotos; estarán separados del catálogo genealógico.</p></div>
              </div>
            )}
          </section>
        ) : (
          <div className={styles.cards}>
            {results.map((breeder) => (
              <article className={styles.card} key={breeder.id}>
                <button className={styles.cardOpen} onClick={() => { setSelected(breeder); setTab("Publicaciones"); }} aria-label={`Abrir página de ${breeder.name}`}>
                  <div className={`${styles.cover} ${styles[`cover${breeder.color}`]}`}>
                    <span className={styles.coverLabel}>TRAVERO · PÁGINA DE TRABA</span>
                    <div className={`${styles.avatarSmall} ${styles[breeder.color]}`}>{breeder.initials}</div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTitleRow}>
                      <h3>{breeder.name}</h3>
                      <span className={breeder.claimed ? styles.claimed : styles.unclaimed}>
                        {breeder.claimed ? "Reclamada" : "Sin reclamar"}
                      </span>
                    </div>
                    <p className={styles.location}>{breeder.location}</p>
                    <p className={styles.specialty}>{breeder.specialty}</p>
                    <span className={styles.cardLink}>Ver página <span aria-hidden="true">→</span></span>
                  </div>
                </button>
              </article>
            ))}
            {results.length === 0 && <p className={styles.empty}>No encontramos páginas con esa búsqueda.</p>}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <span>TRAVERO</span>
        <span>Directorio · Ejemplares · Comunidad</span>
      </footer>
    </main>
  );
}
