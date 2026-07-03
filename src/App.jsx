import { useState, useEffect } from 'react'
import Scrivi from './pagine/Scrivi'
import Leggi from './pagine/Leggi'

function App() {
  const [listaFeedback, setListaFeedback] = useState(() => {
    const datiSalvati = localStorage.getItem('recensioni')
    return datiSalvati ? JSON.parse(datiSalvati) : []
  })
  
  const [schermata, setSchermata] = useState('home')
  const [hoverScrivi, setHoverScrivi] = useState(false)
  const [hoverLeggi, setHoverLeggi] = useState(false)
  const [feedbackInModifica, setFeedbackInModifica] = useState(null)

  useEffect(() => {
    localStorage.setItem('recensioni', JSON.stringify(listaFeedback))
  }, [listaFeedback])

  const salvaFeedback = (feedbackDaSalvare) => {
    const feedbackDaInviare = {
      ...feedbackDaSalvare,
      email: feedbackDaSalvare.email.trim(),
      messaggio: feedbackDaSalvare.messaggio.trim()
    }

    // 🔥 CONTROLLO ANTI-DUPLICATI REALE
    if (listaFeedback.some((fb, index) => {
      if (feedbackInModifica !== null && feedbackInModifica.index === index) {
        return false // Escludi se stesso se in modifica
      }
      return fb.email.toLowerCase().trim() === feedbackDaInviare.email.toLowerCase().trim() && 
             fb.messaggio.toLowerCase().trim() === feedbackDaInviare.messaggio.toLowerCase().trim()
    })) {
      alert("Operazione bloccata: esiste già un feedback identico inviato da questa email.")
      return false // Segnala il blocco al modulo Scrivi
    }

    if (feedbackInModifica !== null) {
      const nuovaLista = listaFeedback.map((fb, index) => 
        index === feedbackInModifica.index ? { ...feedbackDaInviare, stato: fb.stato } : fb
      )
      setListaFeedback(nuovaLista)
    } else {
      const feedbackConStato = { ...feedbackDaInviare, stato: 'Nuovo' }
      setListaFeedback([...listaFeedback, feedbackConStato])
    }
    setFeedbackInModifica(null)
    setSchermata('home') 
    return true // Successo
  }

  const avviaModificaDaLeggi = (index) => {
    setFeedbackInModifica({ index: index, dati: listaFeedback[index] })
    setSchermata('scrivi')
  }

  const aggiornaStatoDiretto = (indexModificato, feedbackAggiornato) => {
    const nuovaLista = listaFeedback.map((fb, index) => 
      index === indexModificato ? feedbackAggiornato : fb
    )
    setListaFeedback(nuovaLista)
  }

  const eliminaFeedback = (indexDaEliminare) => {
    if (window.confirm("Sei sicuro di voler eliminare definitivamente questa recensione?")) {
      const nuovaLista = listaFeedback.filter((_, index) => index !== indexDaEliminare)
      setListaFeedback(nuovaLista)
    }
  }

  const annullaScritturaModifica = () => {
    setFeedbackInModifica(null)
    setSchermata('home')
  }

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',     
      minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa',
      margin: 0, padding: 0, boxSizing: 'border-box'
    }}>
      
      {schermata !== 'home' && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '14px', fontWeight: 'bold', color: '#7490c9', letterSpacing: '1px' }}>
          FEEDBACK PLATFORM
        </div>
      )}

      {schermata === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', maxWidth: '600px', padding: '20px' }}>
          <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#7490c9', letterSpacing: '3px', margin: '0 0 30px 0', lineHeight: '1.1' }}>
            FEEDBACK PLATFORM
          </h1>
          <p style={{ fontSize: '20px', color: '#4a5568', marginBottom: '45px', fontWeight: '500' }}>
            La tua opinione conta!
          </p>
          <button 
            onClick={() => setSchermata('scrivi')}
            onMouseEnter={() => setHoverScrivi(true)} onMouseLeave={() => setHoverScrivi(false)}
            style={{
              padding: '16px 50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '50px', 
              border: '2px solid #7490c9', width: '360px', marginBottom: '20px',
              backgroundColor: hoverScrivi ? '#7490c9' : 'transparent', color: hoverScrivi ? 'white' : '#7490c9',
              transition: 'all 0.3s ease', transform: hoverScrivi ? 'scale(1.03)' : 'scale(1)'
            }}
          >
            SCRIVI UN FEEDBACK
          </button>
          <button    
            onClick={() => setSchermata('leggi')} 
            onMouseEnter={() => setHoverLeggi(true)} onMouseLeave={() => setHoverLeggi(false)}
            style={{
              padding: '16px 50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '50px', 
              border: '2px solid #7490c9', width: '360px',
              backgroundColor: hoverLeggi ? '#7490c9' : 'transparent', color: hoverLeggi ? 'white' : '#7490c9',
              transition: 'all 0.3s ease', transform: hoverLeggi ? 'scale(1.03)' : 'scale(1)'
            }}
          >
            VISUALIZZA / GESTISCI I FEEDBACK
          </button>
        </div>
      )}

      {schermata === 'scrivi' && (
        <Scrivi 
          lista={listaFeedback}
          onInvia={salvaFeedback} 
          onTornaHome={annullaScritturaModifica} 
          datiPrecompilati={feedbackInModifica}
        />
      )}

      {schermata === 'leggi' && (
        <Leggi 
          lista={listaFeedback} 
          onTornaHome={() => setSchermata('home')} 
          onModifica={avviaModificaDaLeggi}
          onElimina={eliminaFeedback}
          onAggiornaStato={aggiornaStatoDiretto}
        />
      )}
    </div> 
  )
}

export default App