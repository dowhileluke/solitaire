export function FilterDefs() {
    return (
        <svg width="0" height="0">
            <defs>
                <filter id="black" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.2 0.2 0.2 0 0
                                                        0.2 0.2 0.2 0 0
                                                        0.2 0.2 0.2 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="pink" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="1 0.5 0.5 0 0
                                                        0.08 0.04 0.04 0 0
                                                        0.576 0.288 0.299 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="red" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.7 0.35 0.35 0 0
                                                        0.1333 0.0666 0.0666 0 0
                                                        0.1333 0.0666 0.0666 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="orange" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.98 0.5 0.5 0 0
                                                        0.5 0.25 0.25 0 0
                                                        0.447 0.22 0.22 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="yellow" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.855 0.427 0.427 0 0
                                                        0.647 0.3235 0.3235 0 0
                                                        0.1255 0.063 0.063 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="green" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0 0 0 0 0
                                                        0.5 0.25 0.25 0 0
                                                        0 0 0 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="turq" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.125 0.063 0.063 0 0
                                                        0.7 0.35 0.35 0 0
                                                        0.667 0.333 0.333 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="blue" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.2745 0.14 0.14 0 0
                                                        0.51 0.25 0.25 0 0
                                                        0.706 0.35 0.35 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="purple" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.58 0.29 0.29 0 0
                                                        0.078 0.039 0.039 0 0
                                                        0.827 0.414 0.414 0 0
                                                        0 0 0 1 0"/>
                </filter>
                {/* Vivid colors */}
                <filter id="red2" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="1 0.5 0.5 0 0
                                                        0 0 0 0 0
                                                        0 0 0 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="blue2" color-interpolation-filters="sRGB">
                    <feColorMatrix type="matrix" values="0.118 0.059 0.59 0 0
                                                        0.5647 0.28 0.28 0 0
                                                        1 0.5 0.5 0 0
                                                        0 0 0 1 0"/>
                </filter>
            </defs>
        </svg>
    )
}
