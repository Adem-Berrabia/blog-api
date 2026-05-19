export { default as Avatar } from "./Avatar";
export default function Avatar({ user, size = 36 }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    objectFit: "cover",
  };

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} style={style} />;
  }

  return (
    <div
      style={{
        ...style,
        background: "#ffc107",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: size * 0.38,
        color: "#212529",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
