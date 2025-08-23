const NavButton = ({ icon, onClick, isdisabled, ...props }) => {
    return (
        <button className="nav-button" onClick={onClick} disabled={isdisabled}>
            <span 
                className="material-symbols-rounded" 
                {...props}
            >
                {icon}
            </span>
        </button>
    )
}

export default NavButton;