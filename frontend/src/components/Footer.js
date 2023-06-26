import React from "react";
import { useLocation } from "react-router-dom";

function Footer() {
  const path = useLocation();
  return (
    <>
      {path.pathname === "/" && (
        <footer className="footer">
          <p className="footer__text">Nasdermn © 2023 Mesto Russia</p>
        </footer>
      )}
    </>
  );
}

export default Footer;