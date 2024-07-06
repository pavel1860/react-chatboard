





export const ScoreComponent = ({ score }: {score: number}) => {

    console.log("#############", `bg-[rgb(255,${Math.round(score * 255)},0)]`)
    return (
        // <span className={`p-1 rounded-lg shadow-sm`} style={{background: `rgb(${Math.round((1-score) * 255)},${Math.round(score * 255)},0)`}}>Score: {roundTo(score, 2)}</span>
        <span className={`p-1 rounded-lg shadow-sm`} style={{background: `rgb(${Math.round((1-score) * 255)},${Math.round(score * 255)},0)`}}>Score: {score}</span>
        
    )
}
