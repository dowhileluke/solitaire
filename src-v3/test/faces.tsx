import { Card } from '../components/card'
import { toSimpleDetails } from '../components/pile'
import pileClasses from '../components/card-pile.module.css'
import { CSSProperties, useState } from 'react'

// const cardIds = [36, 37, 38, 49, 50, 51]
// const cardIds = [10, 11, 12, 23, 24, 25, 36, 37, 38]
// const cardIds = [10, 11, 12, 49, 50, 51]
const cardIds = [23, 24, 25, 36, 37, 38]

type Filters = {
    saturate: number;
    hue: number;
    brightness: number;
    contrast: number;
}

const initFilters: Filters = {
    saturate: 100,
    hue: 0,
    brightness: 100,
    contrast: 100,
}

export function TestFaces() {
    const [state, setState] = useState(initFilters)

    function setFilters(f: Partial<Filters>) {
        setState(prev => ({ ...prev, ...f }))
    }

    const pclass = 'faces four-color rummi'
    const filter = `sepia(1) saturate(${state.saturate}%) hue-rotate(${state.hue}deg) brightness(${state.brightness}%) contrast(${state.contrast}%)`;

    return (
        <div>
            <div className={pclass} style={{ display: 'flex', gap: 4, '--filter': 'var(--red-fi)'} as CSSProperties}>
                {toSimpleDetails(cardIds).map(d => (
                    <ul key={d.id} className={pileClasses.pile}>
                        <Card details={d} />
                    </ul>
                ))}
            </div>
            <div className={pclass} style={{ display: 'flex', gap: 4, '--orange-fi': filter } as CSSProperties}>
                {toSimpleDetails(cardIds).map(d => (
                    <ul key={d.id} className={pileClasses.pile}>
                        <Card details={d} />
                    </ul>
                ))}
            </div>
            <div>
                {(Object.keys(state) as Array<keyof Filters>).map(k => (
                    <div key={k}>
                        {k} <NumRange value={state[k]} onChange={v => setFilters({ [k]: v })} />
                    </div>
                ))}
            </div>
        </div>
    )
}

type NumInputProps = {
    value: number;
    onChange: (n: number) => void;
}

function NumInput({ value, onChange }: NumInputProps) {
    return (
        <input
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{width: '3em'}}
        />
    );
}

function NumRange({ value, onChange }: NumInputProps) {
    return (
        <>
            <NumInput value={value} onChange={onChange} />
            <input type='range' min='0' max='500' value={value} onChange={e => onChange(Number(e.target.value))} />
        </>
    );
}
