import React, { useMemo } from 'react';

export type CalendarEvent = {
  id: string | number;
  start: Date; // assume same-day or ignore end
  title: string;
  onClick?: () => void;
};

type Props = {
  startDate: Date;
  days: number;
  events: CalendarEvent[];
  title?: string;
  onDayClick?: (day: Date) => void;
};

function fmtDateKey(d: Date) {
  return d.toISOString().slice(0,10);
}

const SimpleCalendar: React.FC<Props> = ({ startDate, days, events, title, onDayClick }) => {
  const cells = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [startDate, days]);

  const byDay = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const k = fmtDateKey(ev.start);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(ev);
    }
    return m;
  }, [events]);

  return (
    <div>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8
      }}>
        {cells.map((d) => {
          const key = fmtDateKey(d);
          const day = d.getDate();
          const evs = byDay.get(key) || [];
          return (
            <div key={key} className="card" style={{ padding: 8, minHeight: 100, cursor: 'pointer' }} onClick={() => onDayClick?.(d)}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{day}/{d.getMonth()+1}</div>
              <div style={{ display: 'grid', gap: 4 }}>
                {evs.map((ev) => (
                  <button
                    key={String(ev.id)}
                    className="button"
                    onClick={ev.onClick}
                    style={{
                      background: '#fff', color: 'var(--color-primary)', border: '1px solid var(--color-primary)',
                      padding: '6px 8px', textAlign: 'left'
                    }}
                  >
                    {ev.title}
                  </button>
                ))}
                {evs.length === 0 && <div style={{ color: '#666', fontSize: '.9rem' }}>Sin turnos</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleCalendar;
