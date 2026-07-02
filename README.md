# Feedback Platform

## Descrizione progetto

Feedback Platform è una web app che permette di raccogliere, consultare e gestire i feedback inviati dagli utenti su un prodotto o servizio. Ogni feedback include nome, email, voto (1-5), categoria, messaggio, stato e data di creazione. L'applicazione consente di creare, modificare, eliminare e filtrare i feedback, e salva tutti i dati nel `localStorage` del browser, mantenendoli anche dopo il refresh della pagina.

## Funzionalità implementate

- Creazione di un nuovo feedback tramite form (nome, email, voto a stelle, categoria, messaggio)
- Visualizzazione della lista completa dei feedback inseriti
- Modifica di un feedback esistente (con precompilazione del form)
- Eliminazione di un feedback, con richiesta di conferma
- Cambio dello stato di un feedback direttamente dalla lista (Nuovo, In lavorazione, Risolto, Archiviato)
- Filtro dei feedback per stato
- Filtro dei feedback per categoria
- Ricerca di un feedback per nome o email (live, senza bisogno di conferma)
- Ordinamento dei feedback per data di creazione (crescente/decrescente)
- Ordinamento dei feedback per voto (crescente/decrescente), con priorità sull'ordinamento per data quando attivo
- Salvataggio automatico dei dati in `localStorage`
- Persistenza dei dati dopo il refresh della pagina
- Validazioni sul form:
  - nome obbligatorio
  - email obbligatoria e con formato valido
  - voto obbligatorio, compreso tra 1 e 5
  - categoria obbligatoria (con specifica testuale obbligatoria se si sceglie "Altro")
  - messaggio di almeno 10 caratteri
  - blocco di feedback duplicati (stessa email + stesso messaggio)
- Messaggi di errore chiari mostrati all'utente in caso di validazione fallita

## Tecnologie utilizzate

- **React con Vite**: scelto per la velocità di sviluppo, la configurazione minima. Non essendo necessario il routing lato server, non serviva un framework più complesso come Next.js.
- **Stili scritti in CSS inline**, senza librerie esterne, per mantenere il progetto semplice e senza dipendenze aggiuntive.
- **Visual Studio Code**: editor utilizzato per lo sviluppo del progetto.

## Come avviare il progetto

```bash
npm install
npm run dev
```

L'applicazione sarà disponibile all'indirizzo indicato in console (di norma `http://localhost:5173`).

## Test effettuati

Sono stati verificati manualmente i seguenti scenari:

- Inserimento di un feedback valido, con verifica della comparsa nella lista
- Inserimento con email in formato non valido → errore mostrato correttamente
- Inserimento con messaggio inferiore a 10 caratteri → errore mostrato correttamente
- Inserimento con voto non selezionato (0 stelle) → errore mostrato correttamente
- Inserimento con categoria "Altro" senza specifica → errore mostrato correttamente
- Tentativo di invio di un feedback duplicato (stessa email + stesso messaggio) → bloccato con messaggio di errore
- Modifica di un feedback esistente, con verifica che i dati precompilati siano corretti e che la data di creazione originale venga mantenuta
- Eliminazione di un feedback, con conferma richiesta prima della cancellazione effettiva
- Cambio di stato di un feedback direttamente dalla lista
- Filtro per categoria e per stato, singolarmente e in combinazione
- Ricerca per nome e per email 
- Ordinamento per data (crescente/decrescente) e per voto (crescente/decrescente)
- Refresh della pagina con verifica che i feedback inseriti in precedenza siano ancora presenti (persistenza `localStorage`)


## Note finali 
- **GEMINI E CLAUDE**: utilizzo di strumenti AI
