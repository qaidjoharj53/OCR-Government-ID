import React from "react";
import "./footer.css";

const Footer = () => {
	return (
		<footer className="footer">
			<p>
				&copy; {new Date().getFullYear()} GovID Extractor, Qaidjohar
				Jukker. All rights reserved.
			</p>
			<nav className="footer-nav">
				<a href="/contact" className="footer-link">
					Contact
				</a>
				<a href="/privacy" className="footer-link">
					Privacy Policy
				</a>
				<a href="/terms" className="footer-link">
					Terms of Service
				</a>
			</nav>
		</footer>
	);
};

export default Footer;
