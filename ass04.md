<pre lang="markdown">
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a new note and clicks 'Save'

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note with form data
    activate server
    Note right of server: Server saves the new note and responds with a redirect
    server-->>browser: HTTP 302 Redirect to /notes
    deactivate server

    Note right of browser: Browser follows the redirect and reloads the page

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: Browser executes JavaScript to fetch and render notes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON list of all notes (including the new one)
    deactivate server

    Note right of browser: Browser renders the updated list of notes
```
</pre>