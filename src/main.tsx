
import { createRoot } from 'react-dom/client'
import './index.css'
import LostInTranslation from "./LostInTranslation.tsx";
import Options from "./OpeningMenu.tsx";

createRoot(document.getElementById('root')!).render(
    <>
        <Options/>
    </>,
)
