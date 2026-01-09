import Image from "next/image";
import Tiptap from "./EditorComponents/tiptap";
import NavBar from "./EditorComponents/NavbarComponents/Navbar";

export default function Home() {
  return (
    <>
    <NavBar />
    <Tiptap />
    </>
  );
}
