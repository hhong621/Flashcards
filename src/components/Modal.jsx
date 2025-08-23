export default function Modal(props) {
    const { isOpen, onClose, children } = props;

    if (!isOpen) return null;

    return (
        <div 
            style={{
                backgroundColor: "rgb(0, 0, 0, 25%)",
                backdropFilter: "blur(2px)",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}  
            onClick={onClose}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}