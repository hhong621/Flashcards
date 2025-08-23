import Button from './Button.jsx'
import ToggleSwitch from './ToggleSwitch.jsx';

export default function Header(props) {
    const { uploadFunction, toggleFunction1, toggleFunction2, shuffleFunction } = props;

    return (
        <header>
            <Button
                onClick={uploadFunction}
                label={"Upload File"}
                icon={"upload"}
            />


            <div style={{display: 'flex', gap: '8px'}}>
                <ToggleSwitch
                    name={"startKey"}
                    id1={"startTerm"}
                    value1={"term"}
                    label1={"Term First"}
                    toggleFunction1={toggleFunction1}
                    id2={"startDefinition"}
                    value2={"definition"}
                    label2={"Definition First"}
                    toggleFunction2={toggleFunction2}
                />
                <Button
                    onClick={shuffleFunction}
                    label={"Shuffle"}
                    icon={"shuffle"}
                />
            </div>            
        </header>
    )
}