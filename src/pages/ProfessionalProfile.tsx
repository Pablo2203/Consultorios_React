import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { getMyProfile, updateMyProfile, uploadMyPhoto, type ProfessionalProfile } from "../api/professional";

const ProfessionalProfilePage: React.FC = () => {
  const [data, setData] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const d = await getMyProfile().catch(() => ({ userId: 0, firstName: "", lastName: "", studies: "", specialty: "", bio: "", photoUrl: "" } as any));
        setData(d);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const onChange = (k: keyof ProfessionalProfile, v: string) => data && setData({ ...data, [k]: v } as any);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setLoading(true);
      const saved = await updateMyProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        studies: data.studies || "",
        specialty: data.specialty || "",
        bio: data.bio || "",
        photoUrl: data.photoUrl || "",
      });
      setData(saved);
      alert("Perfil actualizado");
    } catch (e: any) { setError(e?.message || "Error"); }
    finally { setLoading(false); }
  };

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    try {
      const resp = await uploadMyPhoto(e.target.files[0]);
      if (data) setData({ ...data, photoUrl: resp.url });
    } catch (err: any) {
      alert(err?.message || "No se pudo subir la foto");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: '120px 16px 32px', display: "flex", justifyContent: "center", minHeight: '90vh' }}>
        <div className="reserva-wrap" style={{ width: '100%', maxWidth: 720 }}>
        <form onSubmit={onSubmit} className="card" style={{ padding: 24, width: 680, display: "grid", gap: 12, margin: '0 auto' }}>
          <h2>Mi Perfil Profesional</h2>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: "#b00020" }}>{error}</div>}
          {data && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "grid", gap: 4 }}>
                  <span>Nombre</span>
                  <input value={data.firstName || ""} onChange={(e) => onChange("firstName", e.target.value)} />
                </label>
                <label style={{ display: "grid", gap: 4 }}>
                  <span>Apellido</span>
                  <input value={data.lastName || ""} onChange={(e) => onChange("lastName", e.target.value)} />
                </label>
              </div>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Estudios</span>
                <input value={data.studies || ""} onChange={(e) => onChange("studies", e.target.value)} />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Especialidad</span>
                <input value={data.specialty || ""} onChange={(e) => onChange("specialty", e.target.value)} />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Bio</span>
                <textarea value={data.bio || ""} onChange={(e) => onChange("bio", e.target.value)} rows={4} />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Foto (URL)</span>
                <input value={data.photoUrl || ""} onChange={(e) => onChange("photoUrl", e.target.value)} />
              </label>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Subir foto</span>
                <input type="file" accept="image/*" onChange={onSelectFile} />
                {data.photoUrl && (
                  <img src={data.photoUrl} alt="Foto" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }} />
                )}
              </label>
              <button className="button" type="submit" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
            </>
          )}
        </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfessionalProfilePage;
