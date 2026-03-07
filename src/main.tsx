
import { createRoot } from 'react-dom/client'
import './CSS/index.css'
import './CSS/fonts.css'
import OpeningMenu from "@/Components/OpeningMenu.tsx";

createRoot(document.getElementById('root')!).render(
    <>
        <OpeningMenu/>
    </>,
)
