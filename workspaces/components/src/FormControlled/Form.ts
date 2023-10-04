export const FormTheme = {
  Form: {
    baseStyle: () => ({
      requiredIndicator: {
        color: "red",
        fontSize: "0",
        fontWeight: "bold",
        display: "none",
      },
    }),
  },

  FormError: {
    baseStyle: () => ({
      text: {
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: "20px",
        letterSpacing: "0.12px",
      },
    }),
  },
};
