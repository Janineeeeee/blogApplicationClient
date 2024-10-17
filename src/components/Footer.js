import { Container } from 'react-bootstrap';
import './styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer mt-3">
            <Container>
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Swift Ink. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
};
