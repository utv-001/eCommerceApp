import './modal-style.css'

export default function Modal({ visible, onClose, children }) {
    if (!visible) {
        return null
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    )
}