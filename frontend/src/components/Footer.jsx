import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGlobe, faMugHot } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer>
      Made with ❤️ by aniketwazarkar
      {" — "}
      <a href="https://github.com/aniketwazarkar" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faGithub} /> GitHub
      </a>
      {" | "}
      <a href="https://aniketwazarkar.in" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faGlobe} /> Portfolio
      </a>
      {" | "}
      <a href="https://linkedin.com/in/aniketwazarkar" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} /> Linkedin
      </a>
      {" | "}
      <a href="https://buymeacoffee.com/aniketwazarkar" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faMugHot} /> Buy me a coffee
      </a>
    </footer>
  );
}
