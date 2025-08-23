export default function ToggleSwitch(props) {
    const { name, id1, value1, label1, toggleFunction1, id2, value2, label2, toggleFunction2 } = props;

    return (
        <div className="toggleSwitch">
            <input 
                type="radio" 
                id={id1} 
                name={name} 
                value={value1} 
                onChange={toggleFunction1}
                defaultChecked
            >
            </input>
            <label 
                htmlFor={id1}
                className="radioLabel left"
            >
                {label1}
            </label>
            
            <input 
                type="radio" 
                id={id2} 
                name={name} 
                value={value2}
                onChange={toggleFunction2}
            >
            </input>
            <label 
                htmlFor={id2}
                className="radioLabel right"
            >
                {label2}
            </label>
        </div>
    )
}