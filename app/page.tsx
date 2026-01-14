import NavBar from "./EditorComponents/NavbarComponents/Navbar";
import TipTapEditor from "./EditorComponents/Tiptap";

export default function Home() {
  return (
    <>
    <NavBar />
    <div className="m-20 border-none p-4">
    <TipTapEditor />
    </div>
    </>
  );
}
