type TypographyProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function Heading1({ children, ...props }: TypographyProps) {
  const className =
    "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance " +
    (props.className ?? "");
  delete props.className;
  return (
    <h1 className={className} {...props}>
      {children}
    </h1>
  );
}

export function Heading2({ children, ...props }: TypographyProps) {
  const className =
    "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 " +
    (props.className ?? "");
  delete props.className;
  return (
    <h2 className={className} {...props}>
      {children}
    </h2>
  );
}

export function Paragraph({ children, ...props }: TypographyProps) {
  const className =
    "leading-7 [&:not(:first-child)]:mt-6" + (props.className ?? "");
  delete props.className;
  return (
    <p className={className} {...props}>
      {children}
    </p>
  );
}
