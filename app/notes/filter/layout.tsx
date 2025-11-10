type Props = {
  children: React.ReactNode,
  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section style={{ display: "flex", minHeight: "100vh" }} >
      <aside style={{ width: "220px", background: "#f3f4f6", padding: "1rem" }} >{sidebar}</aside>
      <div style={{ flex: 1, padding: "1rem" }}>{children}</div>
    </section>
  );
};

export default NotesLayout;