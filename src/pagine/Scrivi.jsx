import { useState } from 'react'

// Rimosso "lista = []" che non veniva usato
function Scrivi({ onInvia, onTornaHome, datiPrecompilati }) {
  const [nome, setNome] = useState(datiPrecompilati ? datiPrecompilati.dati.nome : '')
  const [email, setEmail] = useState(datiPrecompilati ? datiPrecompilati.dati.email : '')
  const [voto, setVoto] = useState(datiPrecompilati ? datiPrecompilati.dati.voto : 0)
  
  const inizialeCategoria = datiPrecompilati ? datiPrecompilati.dati.categoria : 'Bug'
  const isAltro = inizialeCategoria.startsWith('Altro:')
  
  const [categoria, setCategoria] = useState(isAltro ? 'Altro' : inizialeCategoria)
  const [altraCategoria, setAltraCategoria] = useState(isAltro ? inizialeCategoria.replace('Altro: ', '') : '')
  const [messaggio, setMessaggio] = useState(datiPrecompilati ? datiPrecompilati.dati.messaggio : '')
  const [hoverStelle, setHoverStelle] = useState(0)
  const [errore, setErrore] = useState('')

  const gestisciInvio = (e) => {
    e.preventDefault()
    setErrore('') 

    if (!nome.trim() || !email.trim()) {
      setErrore("Tutti i campi obbligatori devono essere compilati.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrore("L'email deve avere un formato valido.")
      return
    }

    if (voto < 1 || voto > 5) {
      setErrore("Seleziona un voto valido tra 1 e 5 stelle.")
      return
    }

    if (messaggio.trim().length < 10) {
      setErrore("Il messaggio deve contenere almeno 10 caratteri.")
      return
    }

    if (categoria === 'Altro' && !altraCategoria.trim()) {
      setErrore("Specifica la categoria 'Altro'.")
  return
}

    const stringaCategoria = categoria === 'Altro' ? `Altro: ${altraCategoria}` : categoria
    const dataOra = datiPrecompilati ? datiPrecompilati.dati.data : new Date().toLocaleString('it-IT')

    const feedbackDaInviare = {
      nome: nome.trim(),
      email: email.trim(),
      voto,
      categoria: stringaCategoria,
      messaggio: messaggio.trim(),
      data: dataOra
    }

    // Invia i dati e controlla se App.jsx ha accettato l'inserimento
    const successo = onInvia(feedbackDaInviare)
    if (!successo) {
      setErrore("Esiste già una recensione con questa identica combinazione di email e messaggio.")
    }
  }

  const stileRiga = { display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '25px' }
  const stileEtichetta = { width: '150px', minWidth: '150px', fontWeight: '600', color: '#4a5568', fontSize: '16px' }
  const stileInput = { width: '100%', padding: '12px 20px', borderRadius: '50px', border: '2px solid #7490c9', outline: 'none', fontSize: '16px', backgroundColor: 'white', boxSizing: 'border-box' }

  return (
    <div style={{ width: '95%', maxWidth: '750px', fontFamily: 'sans-serif', padding: '20px 0' }}>
      <h2 style={{ color: '#7490c9', fontSize: '38px', textAlign: 'center', fontWeight: 'bold', marginBottom: '35px' }}>
        {datiPrecompilati ? 'Modifica il Feedback' : 'Inviaci il tuo feedback'}
      </h2>

      {errore && (
        <div style={{ backgroundColor: '#ffe3e3', color: '#e53e3e', padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', fontWeight: 'bold', textAlign: 'left', border: '1px solid #f5c2c2', fontSize: '15px' }}>
          ⚠️ {errore}
        </div>
      )}
      
      <form onSubmit={gestisciInvio} style={{ width: '100%' }}>
        <div style={stileRiga}>
          <label style={stileEtichetta}>Nome *</label>
          <div style={{ flex: 1 }}><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Tuo Nome" style={stileInput} /></div>
        </div>

        <div style={stileRiga}>
          <label style={stileEtichetta}>Email *</label>
          <div style={{ flex: 1 }}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tua@email.com" style={stileInput} /></div>
        </div>

        <div style={stileRiga}>
          <label style={stileEtichetta}>Valutazione *</label>
          <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
            {[1, 2, 3, 4, 5].map((stella) => (
              <span
                key={stella} onClick={() => setVoto(stella)} onMouseEnter={() => setHoverStelle(stella)} onMouseLeave={() => setHoverStelle(0)}
                style={{ fontSize: '36px', cursor: 'pointer', color: stella <= (hoverStelle || voto) ? '#FFD700' : '#CBD5E0', transition: 'all 0.15s ease', transform: stella === (hoverStelle || voto) ? 'scale(1.15)' : 'scale(1)', lineHeight: '1' }}
              >★</span>
            ))}
          </div>
        </div>

        <div style={stileRiga}>
          <label style={stileEtichetta}>Categoria *</label>
          <div style={{ flex: 1 }}>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}placeholder="Categoria" style={stileInput}>
              <option value="Bug">👾 Bug</option>
              <option value="Suggerimento">💡 Suggerimento</option>
              <option value="Complimento">👏 Complimento</option>
              <option value="Problema account">👤 Problema account</option>
              <option value="Altro">❓ Altro</option>
            </select>
          </div>
        </div>

        {categoria === 'Altro' && (
          <div style={{ ...stileRiga, alignItems: 'flex-start', marginBottom: '10px' }}>
            <label style={{ ...stileEtichetta, paddingTop: '10px' }}>Specifica Altro *</label>
            <div style={{ flex: 1 }}>
              <input type="text" value={altraCategoria} maxLength={50} onChange={(e) => setAltraCategoria(e.target.value)} placeholder="Inserisci la categoria..." style={stileInput} />
            </div>
          </div>
        )}

        <div style={{ ...stileRiga, alignItems: 'flex-start', marginBottom: '10px' }}>
          <label style={{ ...stileEtichetta, paddingTop: '10px' }}>Messaggio *</label>
          <div style={{ flex: 1 }}>
            <textarea value={messaggio} maxLength={1000} onChange={(e) => setMessaggio(e.target.value)} placeholder="Scrivi qui..." style={{ ...stileInput, height: '140px', borderRadius: '20px', resize: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
          <button type="submit" style={{ padding: '16px 80px', backgroundColor: '#7490c9', color: 'white', border: 'none', borderRadius: '50px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%', maxWidth: '350px' }}>
            {datiPrecompilati ? 'Salva Modifiche' : 'Invia Segnalazione'}
          </button>
          <button type="button" onClick={onTornaHome} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', textDecoration: 'underline', fontSize: '16px' }}>Annulla</button>
        </div>
      </form>
    </div>
  )
}

export default Scrivi