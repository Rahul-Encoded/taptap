import Tiptap from "./EditorComponents/tiptap";
import NavBar from "./EditorComponents/NavbarComponents/Navbar";

export default function Home() {
  return (
    <>
    <NavBar />
    <div className="m-20 border border-border p-4">
    <Tiptap />
    </div>
    </>
  );
}
