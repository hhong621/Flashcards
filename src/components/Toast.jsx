import { useEffect } from "react";

export default function Toast(props) {
    const { isActive, label, icon, dismiss } = props;

    useEffect(() => {
        if(isActive) {
            setTimeout(dismiss, 2000);
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="toast">
            {icon && <span className="material-symbols-rounded">{icon}</span>}
            <span>{label}</span>
        </div>
    )
}