import BackgroundVideo from "./Components/BackgroundVideo";
import Footer from "./Components/Footer";
import Explore from "./Components/explore";

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        height: "calc(100svh - 69.6px)",
        overflowY: "auto",
      }}
    >
      <BackgroundVideo />
      <main style={{ position: "relative", zIndex: 1, paddingTop: "0rem" }}>
        <h1 style={{ color: "white" }}>Welcome to My Next.js App</h1>
        <Explore />
      </main>
      <Footer />
    </div>
  );
}
