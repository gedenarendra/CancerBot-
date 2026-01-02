import "./GlassIcons.css";

const gradientMapping = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(to bottom, #43a047, #2e7d32)",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

// Tambahkan prop 'style' agar posisi fixed dari App.jsx bisa masuk
const GlassIcons = ({ items, className, style }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div
      className={`icon-btns ${className || ""}`}
      style={style} // Teruskan style dari parent (App.jsx) ke sini
    >
      {items.map((item, index) => {
        // 1. Logika Dinamis: Pilih tag 'a' jika ada link, 'button' jika tidak
        const Tag = item.href ? "a" : "button";

        return (
          <Tag
            key={index}
            className={`icon-btn ${item.customClass || ""}`}
            aria-label={item.label}
            // 2. Properti Khusus Link (jika Tag adalah 'a')
            href={item.href || undefined}
            target={item.href ? "_blank" : undefined} // Buka tab baru
            rel={item.href ? "noopener noreferrer" : undefined} // Keamanan
            // 3. Properti Khusus Button (jika Tag adalah 'button')
            type={!item.href ? "button" : undefined}
            // 4. Style agar link tidak ada garis bawah (underline)
            style={{ textDecoration: "none" }}
          >
            <span
              className="icon-btn__back"
              style={getBackgroundStyle(item.color)}
            ></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">
                {item.icon}
              </span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </Tag>
        );
      })}
    </div>
  );
};

export default GlassIcons;
