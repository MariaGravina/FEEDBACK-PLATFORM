import { useState } from 'react'

function Leggi({ lista = [], onTornaHome, onModifica, onElimina, onAggiornaStato }) {
  // Stati dei filtri e dell'ordinamento (ora "live": ogni modifica aggiorna subito la lista)
  const [ricerca, setRicerca] = useState('')
  const [filtroStato, setFiltroStato] = useState('Tutti')
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte')
  const [ordinamentoData, setOrdinamentoData] = useState('data-decrescente')
  const [ordinamentoVoto, setOrdinamentoVoto] = useState('voto-nessuno')

  const ottieniColorePallino = (stato) => {
    switch (stato) {
      case 'Nuovo': return '#ff8800'
      case 'In lavorazione': return '#ffc107'
      case 'Risolto': return '#28a745'
      case 'Archiviato': return '#0065e9'
      default: return '#d000ff'
    }
  }

  const formattaCategoriaConSimbolo = (cat) => {
    if (!cat) return '❓ Altro'
    if (cat === 'Bug') return '👾 Bug'
    if (cat === 'Suggerimento') return '💡 Suggerimento'
    if (cat === 'Complimento') return '👏 Complimento'
    if (cat === 'Problema account') return '👤 Problema account'
    if (cat.startsWith('Altro:')) return `❓ ${cat}`
    return `❓ ${cat}`
  }

  const cambiaStato = (index, fb, nuovoStato) => {
    if (typeof onAggiornaStato === 'function') {
      onAggiornaStato(index, { ...fb, stato: nuovoStato })
    }
  }

  const convertiDataInTimestamp = (stringaData) => {
    try {
      if (!stringaData || typeof stringaData !== 'string') return 0
      const parti = stringaData.split(', ')
      if (parti.length < 2) return 0
      const [giorno, mese, anno] = parti[0].split('/')
      const dataIso = `${anno}-${mese}-${giorno}T${parti[1]}`
      const ts = new Date(dataIso).getTime()
      return isNaN(ts) ? 0 : ts
    } catch {
      return 0
    }
  }

  // Esecuzione dei filtri e degli ordinamenti (si ricalcola automaticamente ad ogni render)
  const listaElaborata = lista
    .map((fb, originaleIndex) => ({ ...fb, originaleIndex }))
    .filter((fb) => {
      const nomeValido = fb.nome ? fb.nome.toLowerCase() : ''
      const emailValida = fb.email ? fb.email.toLowerCase() : ''
      const testoRicerca = ricerca.toLowerCase()

      const matchesRicerca = nomeValido.includes(testoRicerca) || emailValida.includes(testoRicerca)
      const matchesStato = filtroStato === 'Tutti' || fb.stato === filtroStato
      const catAttuale = fb.categoria || ''
      const matchesCategoria =
        filtroCategoria === 'Tutte' ||
        (filtroCategoria === 'Altro' && catAttuale.startsWith('Altro:')) ||
        catAttuale === filtroCategoria

      return matchesRicerca && matchesStato && matchesCategoria
    })
    .sort((a, b) => {
      // Se è impostato un ordinamento per voto prioritario, usa quello
      if (ordinamentoVoto !== 'voto-nessuno') {
        const votoA = Number(a.voto) || 0
        const votoB = Number(b.voto) || 0
        if (ordinamentoVoto === 'voto-decrescente' && votoA !== votoB) return votoB - votoA
        if (ordinamentoVoto === 'voto-crescente' && votoA !== votoB) return votoA - votoB
      }

      // Altrimenti (o in caso di parità di voto) ordina per Data
      if (ordinamentoData === 'data-decrescente') {
        return convertiDataInTimestamp(b.data) - convertiDataInTimestamp(a.data)
      }
      if (ordinamentoData === 'data-crescente') {
        return convertiDataInTimestamp(a.data) - convertiDataInTimestamp(b.data)
      }
      return 0
    })

  const stileInputFiltro = {
    padding: '8px 15px',
    borderRadius: '20px',
    border: '1px solid #7490c9',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '10px 20px', boxSizing: 'border-box' }}>
      <h2 style={{ color: '#7490c9', fontSize: '36px', marginBottom: '20px', fontWeight: 'bold' }}>FEEDBACK RICEVUTI</h2>

      {/* BARRA STRUMENTI FILTRI (LIVE: si applicano subito, senza bottone) */}
      {lista.length > 0 && (
        <div style={{
          backgroundColor: '#eef2fa', padding: '20px', borderRadius: '16px',
          marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px'
        }}>
          {/* Prima riga: Input testo, Stato e Categoria */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
            <input
              type="text"
              placeholder="🔍 Cerca per nome o email..."
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              style={{ ...stileInputFiltro, flex: '2', minWidth: '200px' }}
            />

            <select value={filtroStato} onChange={(e) => setFiltroStato(e.target.value)} style={{ ...stileInputFiltro, flex: '1', minWidth: '130px' }}>
              <option value="Tutti"> Tutti gli stati </option>
              <option value="Nuovo"> 🟠 Nuovo</option>
              <option value="In lavorazione"> 🟡In lavorazione</option>
              <option value="Risolto">🟢 Risolto</option>
              <option value="Archiviato"> 🔒 Archiviato</option>
            </select>

            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ ...stileInputFiltro, flex: '1', minWidth: '150px' }}>
              <option value="Tutte">📁 Tutte le categorie</option>
              <option value="Bug">👾 Bug</option>
              <option value="Suggerimento">💡 Suggerimento</option>
              <option value="Complimento">👏 Complimento</option>
              <option value="Problema account">👤 Problema account</option>
              <option value="Altro">❓ Altro</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <select value={ordinamentoData} onChange={(e) => setOrdinamentoData(e.target.value)} style={stileInputFiltro}>
              <option value="data-decrescente">📅 Data: Più recenti</option>
              <option value="data-crescente">📅 Data: Meno recenti</option>
            </select>

            <select value={ordinamentoVoto} onChange={(e) => setOrdinamentoVoto(e.target.value)} style={stileInputFiltro}>
              <option value="voto-nessuno">⭐ Voto: Nessun filtro</option>
              <option value="voto-decrescente">⭐ Voto: Alto a Basso</option>
              <option value="voto-crescente">⭐ Voto: Basso ad Alto</option>
            </select>
          </div>
        </div>
      )}

      {/* 2. VISUALIZZAZIONE DELLA LISTA DEI FEEDBACK */}
      {lista.length === 0 ? (
        <p style={{ color: 'gray', fontStyle: 'italic', fontSize: '18px' }}>Non ci sono ancora recensioni in elenco.</p>
      ) : listaElaborata.length === 0 ? (
        <p style={{ color: 'gray', fontStyle: 'italic', fontSize: '16px', padding: '20px' }}>Nessun feedback corrisponde ai criteri di ricerca selezionati.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', textAlign: 'left' }}>
          {listaElaborata.map((fb) => (
            <div
              key={fb.originaleIndex}
              style={{
                padding: '20px', backgroundColor: 'white', borderRadius: '16px',
                borderLeft: `6px solid ${ottieniColorePallino(fb.stato || 'Nuovo')}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '15px' }}>
                <button onClick={() => onModifica && onModifica(fb.originaleIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '5px' }}><span title="Modifica questo feedback" style={{ cursor: 'pointer' }}>✏️</span></button>
                <button onClick={() => onElimina && onElimina(fb.originaleIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '5px' }}><span title="Elimina questo feedback" style={{ cursor: 'pointer' }}>🗑️</span></button>
              </div>

              <div style={{ marginBottom: '10px', paddingRight: '80px' }}>
                <strong style={{ fontSize: '18px', color: '#333' }}>
                  {fb.nome} <span style={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>({fb.email})</span>
                </strong>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{fb.data}</div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#eef2fa', color: '#7490c9', padding: '5px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 'bold' }}>
                  {formattaCategoriaConSimbolo(fb.categoria)}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f3f5', padding: '2px 12px', borderRadius: '50px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ottieniColorePallino(fb.stato || 'Nuovo'), display: 'inline-block' }} />
                  <select
                    value={fb.stato || 'Nuovo'}
                    onChange={(e) => cambiaStato(fb.originaleIndex, fb, e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontWeight: 'bold', fontSize: '13px', color: '#495057', cursor: 'pointer', outline: 'none' }}
                  >
                    <option value="Nuovo">Nuovo</option>
                    <option value="In lavorazione">In lavorazione</option>
                    <option value="Risolto">Risolto</option>
                    <option value="Archiviato">Archiviato</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px', fontSize: '18px', color: '#FFD700' }}>
                {'★'.repeat(typeof fb.voto === 'number' ? fb.voto : Number(fb.voto) || 0)}{'☆'.repeat(5 - (typeof fb.voto === 'number' ? fb.voto : Number(fb.voto) || 0))}
              </div>

              <p style={{ margin: 0, color: '#555', lineHeight: '1.5', backgroundColor: '#fafafa', padding: '12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '15px' }}>
                {fb.messaggio}
              </p>
            </div>
          ))}
        </div>
      )}

      <button onClick={onTornaHome} style={{ marginTop: '30px', background: 'none', border: 'none', color: 'gray', cursor: 'pointer', textDecoration: 'underline', fontSize: '16px', marginBottom: '20px' }}>
        Torna alla Home
      </button>
    </div>
  )
}

export default Leggi