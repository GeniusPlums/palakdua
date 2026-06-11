import PortfolioClient from "@/components/PortfolioClient";
import { loadPortfolioBodyHtml, loadPortfolioMeta } from "@/lib/portfolio";

export default function PortfolioPage() {
  const meta = loadPortfolioMeta();
  const bodyHtml = loadPortfolioBodyHtml();

  return (
    <>
      {!meta.complete && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "#101014",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            maxWidth: "min(92vw, 520px)",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          }}
        >
          Portfolio HTML is incomplete. Save the full <code>index.html</code> and
          run <code>npm run extract</code>.
        </div>
      )}
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <PortfolioClient />
    </>
  );
}
