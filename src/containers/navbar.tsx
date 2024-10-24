import { Link } from "wouter";

export default function Navbar() {
  return (
    <div className="p-2 bg-blue-500 font-bold flex">
      <Link asChild href="/">
        <div className="cursor-pointer grow">DND Demo</div>
      </Link>
      <Link asChild href="/preview">
        <div className="cursor-pointer">Preview</div>
      </Link>
    </div>
  );
}
