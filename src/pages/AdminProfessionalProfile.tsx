import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../components/Footer";
import { getProfileByAdmin, updateProfileByAdmin, uploadPhotoByAdmin, type ProfessionalProfile } from "../api/professional";

const AdminProfessionalProfile: React.FC = () => {
  const { userId } = useParams();
  const uid = Number(userId);
  const navigate = useNavigate();
  const [data, setData] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const d = await getProfileByAdmin(uid).catch(() => ({ userId: uid, firstName: "", lastName: "", studies: "", specialty: "", bio: "", photoUrl: "" } as any));
        setData(d);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, [uid]);

  const onChange = (k: keyof ProfessionalProfile, v: string) => data && setData({ ...data, [k]: v } as any);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setLoading(true);
      const saved = await updateProfileByAdmin(uid, {
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
      const resp = await uploadPhotoByAdmin(uid, e.target.files[0]);
      if (data) setData({ ...data, photoUrl: resp.url });
    } catch (err: any) {
      alert(err?.message || "No se pudo subir la foto");
    }
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <Header />
      <section className="section-gradient" style={{padding: '120px 16px 32px', display: "flex", justifyContent: "center", minHeight: '90vh' }}>
        <div className="reserva-wrap" style={{ width: '100%', maxWidth: 720, marginTop: 60 }}>
        <form onSubmit={onSubmit} className="card" style={{ padding: 24, width: 680, display: "grid", gap: 12, margin: '0 auto' }}>
          <h2>Perfil Profesional</h2>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="button" type="submit" disabled={loading}>{loading ? "Guardando…" : "Guardar"}</button>
                <button type="button" className="button" onClick={() => navigate(-1)} style={{ background: '#ffffff', color: 'var(--color-primary)' }}>
                  Atrás
                </button>
              </div>
            </>
          )}
        </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminProfessionalProfile;
