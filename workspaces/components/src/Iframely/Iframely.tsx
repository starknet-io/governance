import { Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    iframely: any;
  }
}

interface IframelyProps {
  url?: string;
  id?: string;
}

export function Iframely(props: IframelyProps) {
  const KEY = props.id;
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [html, setHtml] = useState({
    __html: "<div />",
  });

  useEffect(() => {
    if (props && props.url) {
      fetch(
        `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(
          props.url,
        )}&key=${KEY}&iframe=1&omit_script=1`,
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true);
            if (res.html) {
              setHtml({ __html: res.html });
            } else if (res.error) {
              setError({ code: res.error, message: res.message });
            }
          },
          (error) => {
            setIsLoaded(true);
            setError({ code: 500, message: error.message });
          },
        );
    } else {
      setError({ code: 400, message: "Provide url attribute for the element" });
    }
  }, [props]);

  useEffect(() => {
    window.iframely && window.iframely.load();
  }, []);

  if (error) {
    return (
      <div>
        Error: {error.code} - {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return <Skeleton height="140px" />;
  } else {
    return <div dangerouslySetInnerHTML={html} />;
  }
}
