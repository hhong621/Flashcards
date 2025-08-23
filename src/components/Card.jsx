export default function Card(props) {
    const { isFlipped, frontText, backText, onClick } = props;
    return (
        <div className={`card ${isFlipped}`} onClick={onClick}>
            <div className="card-inner">
                <div className="card-face card-front">
                    {frontText}
                </div>
                <div className="card-face card-back">
                    {backText}
                </div>
            </div>
        </div>
    )
}