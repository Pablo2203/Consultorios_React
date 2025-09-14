import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Footer from "../components/Footer";
import { exportMyAppointmentsCsv, getMyAppointments, createMyAppointmentDirect, updateMyAppointment, cancelMyAppointmentPro } from "../api/professional";
import SimpleCalendar from "../components/SimpleCalendar";

type Appt = any;

function isoLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
}

const ProfessionalAgenda: React.FC = () => {
  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const to = new Date(from); to.setDate(from.getDate() + 30); to.setHours(23,59,59,0);
        const data = await getMyAppointments(isoLocal(from), isoLocal(to));
        setItems(data || []);
      } catch (e: any) { setError(e?.message || "Error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const start = useMemo(() => new Date(), []);
  const events = useMemo(() => (items || []).map((a: any) => ({
    id: a.id,
    start: new Date(a.startsAt),
    title: `${a.startsAt?.slice(11,16) ?? ''} ${a.specialty ?? ''} ${a.firstName ? `- ${a.firstName} ${a.lastName ?? ''}` : ''}`.trim(),
  })), [items]);

  const fromIso = useMemo(() => {
    const d = new Date(start); return isoLocal(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0));
  }, [start]);
  const toIso = useMemo(() => {
    const d = new Date(start); const to = new Date(d.getFullYear(), d.getMonth(), d.getDate()+30, 23,59,59); return isoLocal(to);
  }, [start]);

  // Modal: crear turno en día
  const [dayOpen, setDayOpen] = useState<Date | null>(null);
  const [form, setForm] = useState<any>({ firstName: '', lastName: '', specialty: 'PSICOLOGIA', time: '10:00' });
  const [saving, setSaving] = useState(false);

  async function createDirect() {
    if (!dayOpen) return;
    try {
      setSaving(true);
      const day = new Date(dayOpen);
      const [hh, mm] = String(form.time || '10:00').split(':');
      day.setHours(Number(hh||'10'), Number(mm||'00'), 0, 0);
      const startsAt = day.toISOString().slice(0,19);
      await createMyAppointmentDirect({
        specialty: form.specialty,
        startsAt,
        firstName: form.firstName || 'Paciente',
        lastName: form.lastName || 'SinApellido',
      });
      const data = await getMyAppointments(fromIso, toIso);
      setItems(data || []);
      setDayOpen(null);
    } catch (e: any) { alert(e?.message || 'No se pudo crear el turno'); }
    finally { setSaving(false); }
  }

  // Modal: editar turno
  const [edit, setEdit] = useState<any | null>(null);
  const [editTime, setEditTime] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('SCHEDULED');
  const openEdit = (a: any) => {
    setEdit(a);
    const t = (a?.startsAt || '').slice(11,16) || '10:00';
    setEditTime(t);
    setEditStatus(a?.status || 'SCHEDULED');
  };

  async function applyEdit() {
    if (!edit) return;
    try {
      setSaving(true);
      const d = new Date(edit.startsAt);
      const [hh, mm] = String(editTime || '10:00').split(':');
      d.setHours(Number(hh||'10'), Number(mm||'00'), 0, 0);
      const startsAt = d.toISOString().slice(0,19);
      await updateMyAppointment(edit.id, { startsAt, status: editStatus });
      const data = await getMyAppointments(fromIso, toIso);
      setItems(data || []);
      setEdit(null);
    } catch (e: any) { alert(e?.message || 'No se pudo actualizar'); }
    finally { setSaving(false); }
  }

  async function cancelEdit() {
    if (!edit) return;
    try {
      setSaving(true);
      await cancelMyAppointmentPro(edit.id);
      const data = await getMyAppointments(fromIso, toIso);
      setItems(data || []);
      setEdit(null);
    } catch (e: any) { alert(e?.message || 'No se pudo cancelar'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="section-gradient" style={{ padding: '72px 16px 24px', flex: 1, minHeight: '82vh' }}>
        <div className="reserva-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Mi agenda (30 días)</h2>
            <button className="button" onClick={() => exportMyAppointmentsCsv(fromIso, toIso)}>Exportar CSV</button>
          </div>
          {loading && <div>Cargando…</div>}
          {error && <div style={{ color: '#b00020' }}>{error}</div>}
          <SimpleCalendar startDate={start} days={30} events={events.map((e,i) => ({ ...e, onClick: () => openEdit(items[i]) }))} onDayClick={(d)=>setDayOpen(d)} />
          {!loading && items.length === 0 && <div style={{ marginTop: 8 }}>No hay turnos en el rango.</div>}
        </div>
      </section>
      <Footer />

      {/* Modal crear */}
      {dayOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }} onClick={()=>setDayOpen(null)}>
          <div className="card" style={{ padding:16, width: 420, cursor:'default' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ marginTop:0 }}>Nuevo turno – {dayOpen.toLocaleDateString()}</h3>
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
          <div className="card" style={{ padding:16, width: 420, cursor:'default' }} onClick={e=>e.stopPropagation()}>
            <h3 style={{ marginTop:0 }}>Editar turno – {new Date(edit.startsAt).toLocaleDateString()}</h3>
            <div style={{ display:'grid', gap:8, textAlign:'left' }}>
              <label style={{ display:'grid', gap:4 }}>
                <span>Hora</span>
                <input type="time" value={editTime} onChange={e=>setEditTime(e.target.value)} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Estado</span>
                <select value={editStatus} onChange={e=>setEditStatus(e.target.value)}>
                  {['SCHEDULED','COMPLETED','NO_SHOW'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between', marginTop:8, flexWrap:'wrap' }}>
                <button className="button" onClick={cancelEdit} disabled={saving} style={{ background:'#b00020', padding:'8px 16px', borderRadius:12 }}>Cancelar turno</button>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="button" onClick={()=>setEdit(null)} style={{ background:'#888', padding:'8px 16px', borderRadius:12 }}>Cerrar</button>
                  <button className="button" onClick={applyEdit} disabled={saving} style={{ padding:'8px 16px', borderRadius:12 }}>{saving? 'Guardando…':'Guardar cambios'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAgenda;
