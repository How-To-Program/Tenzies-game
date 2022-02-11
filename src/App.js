import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [times, setTimes] = React.useState(0)
    const [best, setBest] = React.useState(
        () => JSON.parse(localStorage.getItem("best")) || 0
    )

    React.useEffect(() => {
        localStorage.setItem("best", JSON.stringify(best))
    }, [best])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        if (tenzies ){
            return best ? times<best ? setBest(times) : best : setBest(times)
        }
    }, [tenzies])

    React.useEffect(() => {
        localStorage.setItem("best", JSON.stringify(best))
    }, [best])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function record(){

    }

    function rollDice() {
        if(!tenzies) {
            setTimes(times+1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTimes(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <div className="all">
            {tenzies && <Confetti className="confetti"/>}
            <main>
                
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <div className="record-card">
                    <h5 className="best">Best record: {best}</h5>
                    <h5 className="record">Number of rolls: {times}</h5>
                </div>
            </main>
        </div>
    )
}