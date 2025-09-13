import React from "react";
import logoSigo from "../assets/logosigo.svg";
import "./Header.css";

function Header() {

    return (
        <header>
            <img className="header-logo" src={logoSigo} alt="Logo do SIGO" />
        </header>
    )
}

export default Header;