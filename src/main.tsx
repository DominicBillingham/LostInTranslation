
import { createRoot } from 'react-dom/client'
import './CSS/index.css'
import './CSS/fonts.css'
import OpeningMenu from "@/Components/OpeningMenu.tsx";
import LanguageSwitcher from "@/Components/LanguageButton.tsx";
import "./i18n";

createRoot(document.getElementById('root')!).render(
    <>
        <OpeningMenu/>
        <LanguageSwitcher />
    </>
)
