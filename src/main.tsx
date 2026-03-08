
import { createRoot } from 'react-dom/client'
import './CSS/index.css'
import './CSS/fonts.css'
import NotebookContainer from "@/Components/NotebookContainer.tsx";
import "./i18n";

createRoot(document.getElementById('root')!).render(
    <NotebookContainer/>
)
