export { onBeforeRender };

async function onBeforeRender() {
  return {
    pageContext: {
      redirectTo: "/snips",
    },
  };
}
