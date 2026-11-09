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
  const [showCollage, setShowCollage] = useState(false);

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
              <div className={styles.catalogSection}>
                <p className={styles.catalogIntro}>Los ejemplares registrados en TRAVERO que el titular autorice se muestran en este catálogo.</p>
                <article className={styles.specimenCard}>
                  <div className={styles.specimenPhoto} role="img" aria-label="Foto de muestra del ejemplar">
                    <span>Foto del ejemplar</span>
                  </div>
                  <div className={styles.specimenInfo}>
                    <span className={styles.specimenKicker}>CATÁLOGO TRAVERO</span>
                    <h3>Ejemplar de muestra</h3>
                    <p className={styles.specimenPlate}>Placa: <strong>B-000</strong></p>
                    <p className={styles.specimenSummary}>Foto y datos básicos disponibles en su ficha.</p>
                    <button className={styles.primaryButton} onClick={() => setShowCollage(true)}>Ver collage y datos</button>
                  </div>
                </article>
                {showCollage && (
                  <div className={styles.modalBackdrop} role="presentation">
                    <section className={styles.collageModal} role="dialog" aria-modal="true" aria-labelledby="collage-title">
                      <button className={styles.closeButton} onClick={() => setShowCollage(false)} aria-label="Cerrar collage">×</button>
                      <p className={styles.eyebrow}>FICHA DEL EJEMPLAR</p>
                      <h3 id="collage-title">Ejemplar de muestra · B-000</h3>
                      <div className={styles.collageLayout}>
                        <div className={styles.collagePhotos}>
                          <div className={styles.collageMainPhoto}>Foto principal</div>
                          <div className={styles.collageThumbs}>
                            <span>Foto 2</span><span>Foto 3</span><span>Foto 4</span>
                          </div>
                        </div>
                        <dl className={styles.basicData}>
                          <div><dt>Placa</dt><dd>B-000</dd></div>
                          <div><dt>Peso</dt><dd>—</dd></div>
                          <div><dt>Padre</dt><dd>—</dd></div>
                          <div><dt>Madre</dt><dd>—</dd></div>
                          <div><dt>Disponibilidad</dt><dd><span className={styles.available}>Disponible</span></dd></div>
                        </dl>
                      </div>
                      <p className={styles.demoCaption}>Collage de demostración. La ficha real mostrará la foto y los datos autorizados por su dueño.</p>
                    </section>
                  </div>
                )}
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
