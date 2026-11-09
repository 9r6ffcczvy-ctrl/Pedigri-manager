"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./page.module.css";

type DirectoryPage = {
  id: string; slug: string; name: string; profile_photo_url: string | null;
  cover_photo_url: string | null; description: string; country: string | null;
  city: string | null; public_links: Record<string, string>;
  claim_status: "unclaimed" | "claimed" | "verified";
};
type SpecimenListing = {
  id: string; page_id: string; display_name: string | null; plate_number: string | null;
  photo_url: string; additional_photo_urls: string[]; weight: string | null;
  father_label: string | null; mother_label: string | null; price: number | null;
  availability: "available" | "sold" | "not_for_sale";
};
type PageOffering = {
  id: string; page_id: string; offer_type: "product" | "service"; name: string;
  description: string; photo_url: string; price: number | null;
};
const errorText = (e: unknown) =>
  e && typeof e === "object" && "message" in e ? String(e.message) : "No se pudieron cargar los datos.";
const claimText = (status: DirectoryPage["claim_status"]) =>
  status === "verified" ? "Reclamada y verificada" : status === "claimed" ? "Reclamada" : "Sin reclamar";

export default function DirectorioPage() {
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<DirectoryPage[]>([]);
  const [selected, setSelected] = useState<DirectoryPage | null>(null);
  const [tab, setTab] = useState("Publicaciones");
  const [catalog, setCatalog] = useState<SpecimenListing[]>([]);
  const [offerings, setOfferings] = useState<PageOffering[]>([]);
  const [collage, setCollage] = useState<SpecimenListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemsError, setItemsError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await supabase().from("directory_pages")
          .select("id,slug,name,profile_photo_url,cover_photo_url,description,country,city,public_links,claim_status")
          .eq("publication_status", "published").order("name");
        if (error) throw error;
        if (active) setPages((data || []) as DirectoryPage[]);
      } catch (e) {
        if (active) setError(errorText(e));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    async function loadPageContent() {
      setItemsLoading(true);
      setItemsError("");
      try {
        const db = supabase();
        const [c, o] = await Promise.all([
          db.from("directory_specimen_listings")
            .select("id,page_id,display_name,plate_number,photo_url,additional_photo_urls,weight,father_label,mother_label,price,availability")
            .eq("page_id", selected.id).eq("is_published", true),
          db.from("page_offerings")
            .select("id,page_id,offer_type,name,description,photo_url,price")
            .eq("page_id", selected.id).eq("is_published", true),
        ]);
        if (c.error) throw c.error;
        if (o.error) throw o.error;
        if (active) {
          setCatalog((c.data || []) as SpecimenListing[]);
          setOfferings((o.data || []) as PageOffering[]);
        }
      } catch (e) {
        if (active) setItemsError(errorText(e));
      } finally {
        if (active) setItemsLoading(false);
      }
    }
    void loadPageContent();
    return () => { active = false; };
  }, [selected]);

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return pages;
    return pages.filter((p) => [p.name, p.country || "", p.city || "", p.description || ""]
      .join(" ").toLocaleLowerCase().includes(q));
  }, [pages, query]);
  const location = (p: DirectoryPage) => [p.city, p.country].filter(Boolean).join(", ") || "Ubicación no indicada";

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/directorio/" aria-label="TRAVERO, inicio"><span className={styles.brandMark}>T</span><span>TRAVERO</span></a>
        <nav className={styles.nav}><a className={styles.navActive} href="/directorio/">Directorio</a><a href="/login/">Iniciar sesión</a></nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>DIRECTORIO TRAVERO</p>
          <h1>Encuentra tu comunidad.</h1>
          <p className={styles.heroText}>Conoce las trabas, sus publicaciones y sus ejemplares disponibles en un solo lugar.</p>
          <label className={styles.search}><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca por nombre, país o actividad" aria-label="Buscar en el directorio" /></label>
        </div>
        <div className={styles.heroArt} aria-hidden="true"><div className={styles.artCircle} /><div className={styles.artCard}><span className={styles.artLabel}>TRABAS</span><strong>Conectadas<br />por TRAVERO</strong><span className={styles.artLine} /></div><span className={styles.artDot} /></div>
      </section>

      <section className={styles.directory}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>EXPLORA</p><h2>Directorio de trabas</h2></div><span className={styles.resultCount}>{loading ? "…" : results.length + " páginas"}</span></div>
        <div className={styles.notice}><span className={styles.noticeIcon}>i</span><p>Solo se muestran páginas y contenido que el titular haya autorizado para publicación.</p></div>
        {error && <p className={styles.error} role="alert">{error}</p>}

        {selected ? (
          <section className={styles.profile}>
            <button className={styles.backButton} onClick={() => { setSelected(null); setCollage(null); }}>← Volver al directorio</button>
            <div className={styles.profileHeader}>
              {selected.profile_photo_url ? <img className={styles.avatarImage} src={selected.profile_photo_url} alt={"Foto de " + selected.name} /> : <div className={styles.avatarFallback}>{selected.name.slice(0, 2).toUpperCase()}</div>}
              <div className={styles.profileIdentity}>
                <div className={styles.profileTitle}><h2>{selected.name}</h2><span className={selected.claim_status === "unclaimed" ? styles.unclaimed : styles.claimed}>{claimText(selected.claim_status)}</span></div>
                <p>{location(selected)}</p>
                {selected.description && <p className={styles.profileIntro}>{selected.description}</p>}
                {selected.public_links && Object.entries(selected.public_links).length > 0 && <div className={styles.socialLinks}>{Object.entries(selected.public_links).map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>)}</div>}
                <a className={styles.primaryButton} href="/login/">Entrar / reclamar esta página</a>
              </div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Secciones de la página">
              {["Publicaciones", "Catálogo TRAVERO", "Productos y servicios"].map((item) => <button key={item} className={tab === item ? styles.tabActive : styles.tab} onClick={() => { setTab(item); setCollage(null); }} role="tab" aria-selected={tab === item}>{item}</button>)}
            </div>
            {itemsError && <p className={styles.error} role="alert">{itemsError}</p>}
            {itemsLoading && <p className={styles.empty}>Cargando contenido de la página…</p>}

            {!itemsLoading && tab === "Publicaciones" && <div className={styles.catalogPlaceholder}><span className={styles.catalogIcon}>P</span><div><strong>Publicaciones autorizadas</strong><p>Esta sección queda lista para conectar las publicaciones que el titular autorice.</p></div></div>}

            {!itemsLoading && tab === "Catálogo TRAVERO" && (catalog.length === 0
              ? <div className={styles.catalogPlaceholder}><span className={styles.catalogIcon}>T</span><div><strong>Aún no hay ejemplares publicados</strong><p>Los ejemplares aparecerán aquí cuando el titular los seleccione.</p></div></div>
              : <div className={styles.catalogSection}><p className={styles.catalogIntro}>Abre una ficha para ver el collage y sus datos básicos.</p><div className={styles.specimenGrid}>
                {catalog.map((s) => <article className={styles.specimenCard} key={s.id}>
                  <img className={styles.specimenPhoto} src={s.photo_url} alt={s.display_name || s.plate_number || "Foto del ejemplar"} />
                  <div className={styles.specimenInfo}><span className={styles.specimenKicker}>CATÁLOGO TRAVERO</span><h3>{s.display_name || "Placa " + s.plate_number}</h3>
                    {s.display_name && s.plate_number && <p className={styles.specimenPlate}>Placa: <strong>{s.plate_number}</strong></p>}
                    <p className={styles.specimenSummary}>{s.availability === "available" ? "Disponible" : s.availability === "sold" ? "Vendido" : "No está a la venta"}</p>
                    <button className={styles.primaryButton} onClick={() => setCollage(s)}>Ver collage y datos</button>
                  </div>
                </article>)}
              </div></div>)}

            {!itemsLoading && tab === "Productos y servicios" && (offerings.length === 0
              ? <div className={styles.catalogPlaceholder}><span className={styles.catalogIcon}>+</span><div><strong>No hay productos o servicios publicados</strong><p>El titular puede añadirlos por separado del catálogo genealógico.</p></div></div>
              : <div className={styles.offeringGrid}>{offerings.map((o) => <article className={styles.offeringCard} key={o.id}><img src={o.photo_url} alt={o.name} /><div><span className={styles.specimenKicker}>{o.offer_type === "product" ? "PRODUCTO" : "SERVICIO"}</span><h3>{o.name}</h3><p>{o.description}</p>{o.price !== null && <strong>{o.price}</strong>}</div></article>)}</div>)}

            {collage && <div className={styles.modalBackdrop} role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setCollage(null); }}>
              <section className={styles.collageModal} role="dialog" aria-modal="true" aria-labelledby="collage-title">
                <button className={styles.closeButton} onClick={() => setCollage(null)} aria-label="Cerrar collage">×</button>
                <p className={styles.eyebrow}>FICHA DEL EJEMPLAR</p><h3 id="collage-title">{collage.display_name || "Placa " + collage.plate_number}</h3>
                <div className={styles.collageLayout}><div className={styles.collagePhotos}>
                  <img className={styles.collageMainPhoto} src={collage.photo_url} alt={collage.display_name || collage.plate_number || "Foto del ejemplar"} />
                  <div className={styles.collageThumbs}>{(collage.additional_photo_urls || []).map((url, i) => <img key={url + "-" + i} src={url} alt={"Foto adicional " + (i + 1)} />)}</div>
                </div>
                <dl className={styles.basicData}><div><dt>Placa</dt><dd>{collage.plate_number || "—"}</dd></div><div><dt>Peso</dt><dd>{collage.weight || "—"}</dd></div><div><dt>Padre</dt><dd>{collage.father_label || "—"}</dd></div><div><dt>Madre</dt><dd>{collage.mother_label || "—"}</dd></div><div><dt>Disponibilidad</dt><dd><span className={styles.available}>{collage.availability === "available" ? "Disponible" : collage.availability === "sold" ? "Vendido" : "No está a la venta"}</span></dd></div></dl></div>
              </section>
            </div>}
          </section>
        ) : loading ? <p className={styles.empty}>Cargando directorio…</p>
          : results.length === 0 ? <div className={styles.empty}><strong>{query ? "No encontramos páginas con esa búsqueda." : "Todavía no hay páginas públicas."}</strong><p>Las páginas aparecerán aquí cuando sus titulares las preparen y autoricen.</p><a className={styles.primaryButton} href="/login/">Iniciar sesión</a></div>
          : <div className={styles.cards}>{results.map((page) => <article className={styles.card} key={page.id}>
            <button className={styles.cardOpen} onClick={() => { setSelected(page); setTab("Publicaciones"); }} aria-label={"Abrir página de " + page.name}>
              <div className={styles.cover + " " + styles.covergreen} style={page.cover_photo_url ? { backgroundImage: 'url("' + page.cover_photo_url + '")', backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                <span className={styles.coverLabel}>TRAVERO · PÁGINA DE TRABA</span>{page.profile_photo_url && <img className={styles.avatarSmallImage} src={page.profile_photo_url} alt="" />}
              </div>
              <div className={styles.cardContent}><div className={styles.cardTitleRow}><h3>{page.name}</h3><span className={page.claim_status === "unclaimed" ? styles.unclaimed : styles.claimed}>{claimText(page.claim_status)}</span></div><p className={styles.location}>{location(page)}</p>{page.description && <p className={styles.specialty}>{page.description}</p>}<span className={styles.cardLink}>Ver página <span aria-hidden="true">→</span></span></div>
            </button>
          </article>)}</div>}
      </section>
      <footer className={styles.footer}><span>TRAVERO</span><span>Directorio · Ejemplares · Comunidad</span></footer>
    </main>
  );
}
