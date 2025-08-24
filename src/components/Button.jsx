export default function Button(props) {
    const { onClick, label, icon } = props;
    return (
        <button className="Button" onClick={onClick} aria-label={label} {...props}>
            {icon && <span className="material-symbols-rounded">{icon}</span>}
            <span>{label}</span>
        </button>
    )
}