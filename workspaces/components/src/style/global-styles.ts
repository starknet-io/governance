import "@fontsource-variable/inter/slnt.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/500.css";

const headingStyles = {
  fontFamily: "Poppins, sans-serif",
};

export const styles = {
  global: {
    html: {
      fontSize: "16px",
      scrollPaddingTop: "140px",
      padding: 0,
      margin: 0,
    },
    ".dynamic-shadow-dom": {
      " --dynamic-connect-button-background": "#ffffff",
    },

    body: {
      background: "#FAFAFA",
      color: "fg-default",
      padding: 0,
      margin: 0,
      fontFamily: "Inter Variable, sans-serif",
    },
    h1: headingStyles,
    h2: headingStyles,
    h3: headingStyles,
    h4: headingStyles,
    h5: headingStyles,
    h6: headingStyles,
  },
};
