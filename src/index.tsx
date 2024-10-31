import React from 'react';
import ReactDOM from 'react-dom/client';
import {RxGridLab} from "./RxGridLab.tsx";

// Crear un componente simple
function App() {
    return <RxGridLab/>
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App/>)
