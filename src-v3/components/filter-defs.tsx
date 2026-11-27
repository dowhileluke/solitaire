export function FilterDefs() {
    return (
        <svg width="0" height="0">
            <defs>
                <filter id="black" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.2 0.2 0.2 0 0
                                                        0.2 0.2 0.2 0 0
                                                        0.2 0.2 0.2 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="pink" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="1 0.5 0.5 0 0
                                                        0.08 0.04 0.04 0 0
                                                        0.576 0.288 0.299 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="red" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.7 0.35 0.35 0 0
                                                        0.1333 0.0666 0.0666 0 0
                                                        0.1333 0.0666 0.0666 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="orange" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.98 0.5 0.5 0 0
                                                        0.5 0.25 0.25 0 0
                                                        0.447 0.22 0.22 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="yellow" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.855 0.427 0.427 0 0
                                                        0.647 0.3235 0.3235 0 0
                                                        0.1255 0.063 0.063 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="green" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0 0 0 0 0
                                                        0.5 0.25 0.25 0 0
                                                        0 0 0 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="turq" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.125 0.063 0.063 0 0
                                                        0.7 0.35 0.35 0 0
                                                        0.667 0.333 0.333 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="blue" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.2745 0.14 0.14 0 0
                                                        0.51 0.25 0.25 0 0
                                                        0.706 0.35 0.35 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="purple" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.58 0.29 0.29 0 0
                                                        0.078 0.039 0.039 0 0
                                                        0.827 0.414 0.414 0 0
                                                        0 0 0 1 0"/>
                </filter>
                {/* Vivid colors */}
                <filter id="red2" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="1 0.5 0.5 0 0
                                                        0 0 0 0 0
                                                        0 0 0 0 0
                                                        0 0 0 1 0"/>
                </filter>
                <filter id="blue2" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0.118 0.059 0.59 0 0
                                                        0.5647 0.28 0.28 0 0
                                                        1 0.5 0.5 0 0
                                                        0 0 0 1 0"/>
                </filter>
                {/* monochromes */}
                <filter id="mono-black" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.2 1" />
                        <feFuncG type="table" tableValues="0.2 1" />
                        <feFuncB type="table" tableValues="0.2 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-pink" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="1 1" />
                        <feFuncG type="table" tableValues="0.08 1" />
                        <feFuncB type="table" tableValues="0.576 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-red" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.7 1" />
                        <feFuncG type="table" tableValues="0.1333 1" />
                        <feFuncB type="table" tableValues="0.1333 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-orange" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.98 1" />
                        <feFuncG type="table" tableValues="0.5 1" />
                        <feFuncB type="table" tableValues="0.447 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-yellow" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.855 1" />
                        <feFuncG type="table" tableValues="0.647 1" />
                        <feFuncB type="table" tableValues="0.1255 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-green" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0 1" />
                        <feFuncG type="table" tableValues="0.5 1" />
                        <feFuncB type="table" tableValues="0 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-turq" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.125 1" />
                        <feFuncG type="table" tableValues="0.7 1" />
                        <feFuncB type="table" tableValues="0.67 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-blue" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.2745 1" />
                        <feFuncG type="table" tableValues="0.51 1" />
                        <feFuncB type="table" tableValues="0.706 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-purple" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.58 1" />
                        <feFuncG type="table" tableValues="0.078 1" />
                        <feFuncB type="table" tableValues="0.827 1" />
                    </feComponentTransfer>
                </filter>

                <filter id="mono-red2" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="1 1" />
                        <feFuncG type="table" tableValues="0 1" />
                        <feFuncB type="table" tableValues="0 1" />
                    </feComponentTransfer>
                </filter>
                <filter id="mono-blue2" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="table" tableValues="0.118 1" />
                        <feFuncG type="table" tableValues="0.5647 1" />
                        <feFuncB type="table" tableValues="1 1" />
                    </feComponentTransfer>
                </filter>
            </defs>
        </svg>
    )
}
