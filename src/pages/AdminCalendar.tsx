import React, { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import Footer from '../components/Footer';
import { getAllUsers, getAppointmentsByProfessional, updateAppointmentByAdmin, cancelAppointmentByAdmin, type ProfessionalSummary, type UserSummary } from '../api/admin';
import { getProfileByAdmin } from '../api/professional';
import SimpleCalendar from '../components/SimpleCalendar';

function isoLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
}

const AdminCalendar: React.FC = () => {
  const [pros, setPros] = useState<ProfessionalSummary[]>([]);
  const [pending, setPending] = useState<string>('');
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useMemo(() => new Date(), []);
  const fromIso = useMemo(() => {
    const d = new Date(start); return isoLocal(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0));
  }, [start]);
  const toIso = useMemo(() => {
    const d = new Date(start); const to = new Date(d.getFullYear(), d.getMonth(), d.getDate()+30, 23,59,59); return isoLocal(to);
  }, [start]);

  useEffect(() => {
    (async () => {
      try {
        // Tomamos sólo profesionales aprobados (enabled=true)
        const users: UserSummary[] = await getAllUsers().catch(() => [] as UserSummary[]);
        const enabled = users.filter(u => u.role === 'PROFESSIONAL' && u.enabled);
        // Resolvemos nombre y apellido desde el perfil; fallback al username
        const list: ProfessionalSummary[] = await Promise.all(enabled.map(async (u) => {
          try {
            const prof = await getProfileByAdmin(u.id);
            const name = `${prof.firstName || ''} ${prof.lastName || ''}`.trim();
            return { id: u.id, username: (name || u.username || '').toUpperCase(), email: undefined } as ProfessionalSummary;
          } catch {
            return { id: u.id, username: (u.username || '').toUpperCase(), email: undefined } as ProfessionalSummary;
          }
        }));
        const sorted = [...list].sort((a, b) => (a.username || '').localeCompare((b.username || ''), 'es', { sensitivity: 'base' }));
        setPros(sorted);
        if (sorted.length > 0) setPending(String(sorted[0].id));
        else setPending('enum:PEPITO');
        setError(null);
      } catch { /* ocultar error visual si la API falla */ }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (selected.startsWith('enum:')) {
          setItems([]);
        } else {
          const data = await getAppointmentsByProfessional(Number(selected), fromIso, toIso);
          setItems(data || []);
        }
      } catch (e: any) { setError(e?.message || 'Error cargando agenda'); }
      finally { setLoading(false); }
    })();
  }, [selected, fromIso, toIso]);

  const events = useMemo(() => (items || []).map((a: any, i: number) => ({
    id: a.id,
    start: new Date(a.startsAt),
    title: `${a.startsAt?.slice(11,16) ?? ''} ${a.firstName ?? ''} ${a.lastName ?? ''}`.trim(),
    onClick: () => openEdit(items[i])
  })), [items]);

  // Modal de gestión por día
  const [dayOpen, setDayOpen] = useState<Date | null>(null);
  const [form, setForm] = useState<any>({ firstName: '', lastName: '', email: '', specialty: 'PSICOLOGIA', time: '10:00' });
  const [saving, setSaving] = useState(false);
  // listado de especialidades (se usa directamente en el JSX)

  // Modal de edición de turno
  const [edit, setEdit] = useState<any | null>(null);
  const [editTime, setEditTime] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('SCHEDULED');
  const [editEmail, setEditEmail] = useState<string>('');

  const openEdit = (a: any) => {
    setEdit(a);
    const t = (a?.startsAt || '').slice(11,16) || '10:00';
    setEditTime(t);
    setEditStatus(a?.status || 'SCHEDULED');
    setEditEmail(a?.email || '');
  };

  async function createDirect() {
    if (!dayOpen || !selected) return;
    try {
      setSaving(true);
      const day = new Date(dayOpen);
      const [hh, mm] = String(form.time || '10:00').split(':');
      day.setHours(Number(hh||'10'), Number(mm||'00'), 0, 0);
      const startsAt = isoLocal(day);
      if (selected.startsWith('enum:')) {
        alert('Seleccioná un profesional real de la lista para crear turnos.');
        return;
      }
      const mod = await import('../api/admin');
      await mod.createAppointmentDirect({
        professionalId: Number(selected),
        specialty: form.specialty,
        startsAt,
        firstName: form.firstName || 'Paciente',
        lastName: form.lastName || 'SinApellido',
        email: form.email || undefined,
      });
      const data = await getAppointmentsByProfessional(Number(selected), fromIso, toIso);
      setItems(data || []);
      setDayOpen(null);
    } catch (e: any) { alert(e?.message || 'No se pudo crear el turno'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <Header />
      <section className="section-gradient" style={{ padding: "72px 16px 24px", minHeight: '82vh'}}>
        <div className="reserva-wrap">
          <h2>Calendario de turnos (Admin)</h2>
          <div className="card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent :'center', marginTop: 80 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Profesional</span>
              <select value={pending} onChange={e=>setPending(e.target.value)}>
                {pros.map(p => <option key={p.id} value={String(p.id)}>{p.username}</option>)}
                <optgroup label="Enumerados (catálogo)">
                  <option value="enum:PEPITO">PEPITO</option>
                  <option value="enum:MENGANO">MENGANO</option>
                  <option value="enum:FULANO">FULANO</option>
                </optgroup>
              </select>
              <button className="button" onClick={() => setSelected(pending)} style={{ marginTop: 6, alignItems: 'center'    }}>Aceptar</button>
            </label>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          {selected && (
            <div style={{ marginTop: 24 }}>
              <SimpleCalendar startDate={start} days={30} events={events} onDayClick={(d)=>setDayOpen(d)} />
            </div>
          )}
        </div>
      </section>
      <Footer />
      {/* Modal crear */}
      {dayOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }} onClick={()=>setDayOpen(null)}>
          <div className="card" style={{ padding:16, width: 420, cursor:'default' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ marginTop:0 }}>Gestión de {dayOpen.toLocaleDateString()}</h3>
            <div style={{ display:'grid', gap:8, textAlign:'left' }}>
              <label style={{ display:'grid', gap:4 }}>
                <span>Hora</span>
                <input type="time" value={form.time} onChange={e=>setForm({ ...form, time: e.target.value })} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Especialidad</span>
                <select value={form.specialty} onChange={e=>setForm({ ...form, specialty: e.target.value })}>
                  {['PSICOLOGIA','PSIQUIATRIA','NUTRICION','FONOAUDIOLOGIA','CARDIOLOGIA'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Nombre del paciente</span>
                <input value={form.firstName} onChange={e=>setForm({ ...form, firstName: e.target.value })} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Apellido del paciente</span>
                <input value={form.lastName} onChange={e=>setForm({ ...form, lastName: e.target.value })} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Email del paciente (opcional)</span>
                <input type="email" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} placeholder="para mostrarle el turno en su cuenta" />
              </label>
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:8 }}>
                <button className="button" onClick={()=>setDayOpen(null)} style={{ background:'#888', padding:'8px 16px', borderRadius:12 }}>Cerrar</button>
                <button className="button" onClick={createDirect} disabled={saving} style={{ padding:'8px 16px', borderRadius:12 }}>{saving? 'Guardando…':'Crear turno'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal editar */}
      {edit && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }} onClick={()=>setEdit(null)}>
          <div className="card" style={{ padding:16, width: 460, cursor:'default' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ marginTop:0 }}>Editar turno – {new Date(edit.startsAt).toLocaleDateString()}</h3>
            <div style={{ display:'grid', gap:8, textAlign:'left' }}>
              <label style={{ display:'grid', gap:4 }}>
                <span>Hora</span>
                <input type="time" value={editTime} onChange={e=>setEditTime(e.target.value)} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Estado</span>
                <select value={editStatus} onChange={e=>setEditStatus(e.target.value)}>
                  {['SCHEDULED','COMPLETED','NO_SHOW','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Email del paciente</span>
                <input type="email" value={editEmail} onChange={e=>setEditEmail(e.target.value)} placeholder="para vincular con su cuenta" />
              </label>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between', marginTop:8, flexWrap:'wrap' }}>
                <button className="button" onClick={async ()=>{ try{ setSaving(true); await cancelAppointmentByAdmin(edit.id); const data = await getAppointmentsByProfessional(Number(selected), fromIso, toIso); setItems(data||[]); setEdit(null);} catch(e:any){ alert(e?.message||'No se pudo cancelar'); } finally{ setSaving(false); } }} disabled={saving} style={{ background:'#b00020', padding:'8px 16px', borderRadius:12 }}>Cancelar turno</button>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="button" onClick={()=>setEdit(null)} style={{ background:'#888', padding:'8px 16px', borderRadius:12 }}>Cerrar</button>
                  <button className="button" onClick={async ()=>{
                    try{
                      setSaving(true);
                      const d = new Date(edit.startsAt);
                      const [hh,mm] = String(editTime||'10:00').split(':');
                      d.setHours(Number(hh||'10'), Number(mm||'00'), 0, 0);
                      await updateAppointmentByAdmin(edit.id, { startsAt: isoLocal(d), status: editStatus, email: editEmail || undefined });
                      const data = await getAppointmentsByProfessional(Number(selected), fromIso, toIso);
                      setItems(data||[]);
                      setEdit(null);
                    } catch(e:any){ alert(e?.message||'No se pudo guardar'); } finally{ setSaving(false); }
                  }} disabled={saving} style={{ padding:'8px 16px', borderRadius:12 }}>{saving? 'Guardando…':'Guardar cambios'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
