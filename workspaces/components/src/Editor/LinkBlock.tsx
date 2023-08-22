const LinkBlock = ({ attributes, element, children }: any) => {
  const handleOnClick = () => {
    element.href && window.open(element.href, element.target);
  };

  return (
    <div
      onClick={handleOnClick}
      style={{ display: "inline"}}
    >
      <a
        href={element.href}
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
