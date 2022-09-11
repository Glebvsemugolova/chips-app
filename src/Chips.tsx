import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Chip } from "./Chip";

const chips = new Array(20).fill(null).map((_, i) => `Item ${i + 1}`);

export function Chips() {
    const containerRef = useRef<any>();
    const [containerRect, setContainerRect] = useState<DOMRect | undefined>();
    const [extraElIndex, setExtraElIndex] = useState<number>(-1);
    const [activeChipIndex, setActiveChipIndex] = useState<number | null>(null)

    const chipWithDotsWidth = 40
    const isAllElementsPlaced = extraElIndex === -1
    const overflowChips = isAllElementsPlaced ? []: chips.slice(extraElIndex);
    const visibleChips = isAllElementsPlaced ? chips : chips.slice(0, extraElIndex);

    useLayoutEffect(() => {
        if (containerRef.current) {
            setContainerRect(containerRef.current.getBoundingClientRect());
        }
    }, []);

    // resize debounce
    useEffect(() => {
        let timeoutId: any;
        const updateContainerRect = () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }

            if (containerRef.current) {
                timeoutId = setTimeout(() => {
                    setContainerRect(containerRef.current.getBoundingClientRect());
                    setExtraElIndex(-1);
                }, 50);
            }
        };

        window.addEventListener("resize", updateContainerRect);

        return () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            window.removeEventListener("resize", updateContainerRect);
        };
    }, []);



    return (
        <>
            <div
                ref={containerRef}
                className="container"
            >
                {visibleChips.map((chip, index) => (
                    <Chip
                        key={chip}
                        title={chip}
                        extraElIndex={index}
                        parentRect={containerRect}
                        setExtraElIndex={setExtraElIndex}
                        activeChipIndex={activeChipIndex}
                        setActiveChipIndex={setActiveChipIndex}
                        chipWithDotsWidth={chipWithDotsWidth}
                    />
                ))}
                {extraElIndex !== -1 && (
                    <details className={'dots'} style={{width: chipWithDotsWidth}}>
                        <summary>
                            <div >...</div>
                        </summary>
                        <div className="popover">
                            {overflowChips.map((chip, index) => (
                                <div
                                    key={index}
                                    className={`chip ${activeChipIndex === chips.indexOf(chip) ? 'active' : ''}`}
                                    onClick={() => {
                                        const originalChipIndex = chips.indexOf(chip)
                                        if (activeChipIndex === originalChipIndex) {
                                            setActiveChipIndex(null)
                                        } else {
                                            setActiveChipIndex(originalChipIndex)
                                        }
                                    }}
                                >
                                    {chip}
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        </>
    );
}