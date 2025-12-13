// Layout pattern
import Link from "next/link";

export default function Layout( {children} ) {
    return (
        <div className="app-container">
            <header className="app-header">
                <div className="app-title">FuelMe</div>

                {/*Navigation bar template*/}
                <nav className="app-nav">
                    <Link href="/">Home</Link>
                    <Link href="/signup">Register</Link>
                    <Link href="/login">Login</Link>
                </nav>
            </header>
            <main className="app-main">{children}</main>
        </div>
    );
}