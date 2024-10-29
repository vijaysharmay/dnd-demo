import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Navbar() {
  return (
    <div className="p-2 bg-blue-500 font-bold flex gap-x-2">
      <Link asChild href="/">
        <div className="grow">
          <Button className="bg-black font-sans text-md text-white cursor-pointer">
            Home
          </Button>
        </div>
      </Link>
      <div className=" grow">
        <Button className="bg-black font-sans text-md text-white cursor-pointer">
          Data & Schema Manager
        </Button>
      </div>
      <Link asChild href="/preview">
        <Button className="bg-black font-sans text-md text-white cursor-pointer align-right">
          Preview
        </Button>
      </Link>
    </div>
  );
}
