import "./Section.css";

interface SectionProps extends React.PropsWithChildren {
  id?: string;
}

function Section({ children, id }: SectionProps) {
  return (
    <>
      <section id={id}>
        <div className="constrained">{children}</div>
      </section>
    </>
  );
}

export default Section;
