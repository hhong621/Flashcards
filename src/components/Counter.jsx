export default function Counter(props) {
    const { currentNum, total } = props;
    return (
        <div className="counter">
            <span>{currentNum}</span> / <span>{total}</span>
        </div>
    )
}