const LinkBlock = ({ attributes, element, children }: any) => {
  const handleOnClick = () => {
    element.link && window.open(element.link, element.target);
  };

  return (
    <div
      onClick={handleOnClick}
      style={{ display: "inline"}}
    >
      <a
        href={element.link}
        {...attributes}
        {...element.attr}
        target={element.target}
        style={{ color: "blue", textDecoration: "underline" }}
      >
        {children}
      </a>
    </div>
  );
};

export default LinkBlock;
