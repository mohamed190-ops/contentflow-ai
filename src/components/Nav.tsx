"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "@/lib/store";

const links = [
  { href: "/dashboard", label: "Hoje" },
  { href: "/calendar", label: "Calendário" },
  { href: "/ideas", label: "Ideias salvas" },
  { href: "/profile", label: "Perfil" },
  { href: "/billing", label: "Assinatura" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAccount();

  if (!session || pathname === "/" || pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-foreground">
          ContentFlow <span className="text-accent">AI</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === l.href ? "bg-accent/10 text-accent-dark" : "text-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-sm text-muted hover:text-foreground"
        >
          Sair
        </button>
      </div>
      <nav className="sm:hidden flex overflow-x-auto px-4 pb-2 gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              pathname === l.href ? "bg-accent/10 text-accent-dark" : "text-muted"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
