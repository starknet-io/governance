const ImageBlock = ({ attributes, element, children }: any) => {
  const { link, caption } = element;

  return (
    <div
      {...attributes}
      style={{
        display: "flex",
      }}
      {...element.attr}
    >
      <div contentEditable={false}>
        <img alt={caption} src={link} />
      </div>
      {children}
    </div>
  );
};
export default ImageBlock;
