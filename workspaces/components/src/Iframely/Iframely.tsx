import { Box, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LinkCard } from "src/LinkCard";

interface IframelyProps {
  url?: string;
  id?: string;
}

interface IframelyData {
  title?: string;
  description?: string;
  author?: string;
  thumbnail_url?: string;
  provider_name?: string;
  type?: string;
}

export function Iframely(props: IframelyProps) {
  const KEY = props.id;
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<IframelyData | null>(null);

  useEffect(() => {
    if (props && props.url) {
      const encodedUrl = encodeURIComponent(props.url);

      fetch(
        `https://cdn.iframe.ly/api/iframely?url=${encodedUrl}&api_key=${KEY}`,
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true);
            if (res.html) {
              setData({
                title: res.meta.title || "Default Title",
                description:
                  res.meta.description || "No description available.",
                thumbnail_url: res.links.thumbnail[0]?.href || "",
                provider_name: res.meta.site || "Unknown Provider",
                type: res.meta.medium,
              });
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

  if (error) {
    return (
      <div>
        Error: {error.code} - {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return <Skeleton height="110px" />;
  } else if (data) {
    return (
      <>
        <LinkCard
          title={data.title}
          src={data.thumbnail_url}
          description={data.description}
          href={props.url || ""}
        />
      </>
    );
  } else {
    return null;
  }
}
