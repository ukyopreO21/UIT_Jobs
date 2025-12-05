import Header from "./components/Header";
import Footer from "./components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-dvh">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
