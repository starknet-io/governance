const ImageBlock = ({ attributes, element, children }: any) => {
  const { url, alt } = element;

  return (
    <div
      {...attributes}
      className="embed"
      style={{
        display: "flex",
      }}
      {...element.attr}
    >
      <div contentEditable={false}>
        <img alt={alt} src={url} />
      </div>
      {children}
    </div>
  );
};
export default ImageBlock;
