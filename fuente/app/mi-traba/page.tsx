"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type TrabaPage = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  profile_photo_url: string | null;
  cover_photo_url: string | null;
  description: string;
  country: string | null;
  city: string | null;
  public_links: Record<string, string>;
  claim_status: "claimed" | "verified";
  publication_status: "draft" | "published";
};

const columns = "id,owner_id,slug,name,profile_photo_url,cover_photo_url,description,country,city,public_links,claim_status,publication_status";
const errorText = (e: unknown) => e && typeof e === "object" && "message" in e ? String(e.message) : "No se pudo guardar la página.";
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function MiTrabaPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [pages, setPages] = useState<TrabaPage[]>([]);
  const [activePage, setActivePage] = useState<TrabaPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = supabase();
        const { data: { user }, error: authError } = await db.auth.getUser();
        if (authError || !user) { router.replace("/login"); return; }
        const { data, error: pagesError } = await db.from("directory_pages").select(columns).eq("owner_id", user.id).order("name");
        if (pagesError) throw pagesError;
        if (active) {
          setUserId(user.id);
          setPages((data || []) as TrabaPage[]);
          setActivePage((data && data.length ? data[0] : null) as TrabaPage | null);
        }
      } catch (e) {
        if (active) setError(errorText(e));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const slug = slugify(String(form.get("slug") || name));
    const profilePhoto = String(form.get("profile_photo_url") || "").trim();
    const publicationStatus = String(form.get("publication_status") || "draft");
    if (!name || !slug) { setError("Escribe el nombre de la traba para crear su página."); setSaving(false); return; }
    if (publicationStatus === "published" && !profilePhoto) { setError("Añade la foto de perfil de la traba antes de publicar."); setSaving(false); return; }
    const links: Record<string, string> = {};
    for (const [key, label] of [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"]]) {
      const value = String(form.get(key) || "").trim();
      if (value) links[label] = value;
    }
    const payload = {
      name, slug, profile_photo_url: profilePhoto || null,
      cover_photo_url: String(form.get("cover_photo_url") || "").trim() || null,
      description: String(form.get("description") || "").trim(),
      country: String(form.get("country") || "").trim() || null,
      city: String(form.get("city") || "").trim() || null,
      public_links: links,
      publication_status: publicationStatus,
    };
    try {
      const db = supabase();
      const result = activePage
        ? await db.from("directory_pages").update(payload).eq("id", activePage.id).select(columns).single()
        : await db.from("directory_pages").insert(payload).select(columns).single();
      if (result.error) throw result.error;
      const saved = result.data as TrabaPage;
      setPages((current) => activePage ? current.map((p) => p.id === saved.id ? saved : p) : [...current, saved].sort((a, b) => a.name.localeCompare(b.name)));
      setActivePage(saved);
      setNotice(saved.publication_status === "published" ? "Página guardada y publicada." : "Borrador guardado. Solo tú puedes verlo.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="panel"><p>Cargando tu página…</p></section>;

  return (
    <section className="panel">
      <p className="eyebrow">TRAVERO · TU PÁGINA</p>
      <h1>Mi página de traba</h1>
      <p className="muted">Cada traba tiene su propia página. Completa la presentación y elige cuándo publicarla.</p>
      {error && <p role="alert" className="error">{error}</p>}
      {notice && <p role="status">{notice}</p>}

      <div className="filters">
        <label>Seleccionar traba
          <select value={activePage?.id || ""} onChange={(e) => { const next = pages.find((p) => p.id === e.target.value) || null; setActivePage(next); setError(""); setNotice(""); }}>
            <option value="">{pages.length ? "Crear una página nueva" : "Crea la primera página"}</option>
            {pages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <div><button type="button" className="secondary" onClick={() => { setActivePage(null); setError(""); setNotice(""); }}>+ Crear otra página</button></div>
      </div>

      {activePage?.publication_status === "published" && <p><a href={"/directorio/?traba=" + encodeURIComponent(activePage.slug)}>Abrir página pública</a></p>}

      <form key={activePage?.id || "new"} onSubmit={savePage}>
        <fieldset disabled={saving}>
          <label>Nombre de la traba *<input name="name" required maxLength={120} defaultValue={activePage?.name || ""} /></label>
          <label>Enlace corto<input name="slug" maxLength={80} defaultValue={activePage?.slug || ""} placeholder="Se crea desde el nombre" /></label>
          <label>URL de la foto de perfil *<input name="profile_photo_url" type="url" defaultValue={activePage?.profile_photo_url || ""} placeholder="https://…" /></label>
          <label>URL de foto de portada<input name="cover_photo_url" type="url" defaultValue={activePage?.cover_photo_url || ""} placeholder="https://…" /></label>
          <p className="muted">La carga de fotos desde el teléfono se conectará a almacenamiento en el siguiente paso.</p>
          <label>Presentación<textarea name="description" rows={4} maxLength={2000} defaultValue={activePage?.description || ""} /></label>
          <div className="filters">
            <label>País<input name="country" maxLength={80} defaultValue={activePage?.country || ""} /></label>
            <label>Ciudad<input name="city" maxLength={100} defaultValue={activePage?.city || ""} /></label>
          </div>
          <h2>Redes sociales</h2>
          <label>Facebook<input name="facebook" type="url" defaultValue={activePage?.public_links?.Facebook || ""} placeholder="https://…" /></label>
          <label>Instagram<input name="instagram" type="url" defaultValue={activePage?.public_links?.Instagram || ""} placeholder="https://…" /></label>
          <label>YouTube<input name="youtube" type="url" defaultValue={activePage?.public_links?.YouTube || ""} placeholder="https://…" /></label>
          <label>Estado de la página<select name="publication_status" defaultValue={activePage?.publication_status || "draft"}><option value="draft">Borrador — solo yo</option><option value="published">Publicar página</option></select></label>
          <button>{saving ? "Guardando…" : activePage ? "Guardar cambios" : "Crear página"}</button>
        </fieldset>
      </form>

      <div className="filters">
        <a className="secondary" href="/dashboard/">Abrir TRAVERO y registrar ejemplares</a>
        <a href="/directorio/">Volver al directorio</a>
      </div>
      <p className="muted">Sesión de la cuenta: {userId ? "activa" : "no disponible"}.</p>
    </section>
  );
}
