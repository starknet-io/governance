import { useEffect } from "react";

export default function TallyScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://tally.so/widgets/embed.js";
    script.id = "tally-js";
    script.onload = () => {
      if ((window as any).Tally) (window as any).Tally.loadEmbeds();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null;
}
