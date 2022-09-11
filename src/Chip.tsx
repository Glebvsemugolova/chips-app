import { useLayoutEffect, useRef } from "react";

export interface ChipProps {
    title: string
    extraElIndex: number
    chipWithDotsWidth: number
    activeChipIndex: number | null
    parentRect: DOMRect | undefined
    setExtraElIndex: (index: any) => void
    setActiveChipIndex: (index: number | null) => void
}

export function Chip({ title, extraElIndex, setExtraElIndex, parentRect, chipWithDotsWidth, activeChipIndex, setActiveChipIndex }: ChipProps) {
    const ref = useRef<any>();

    useLayoutEffect(() => {
        if (ref.current && parentRect) {
            const child = ref.current.getBoundingClientRect();

            const marginRight = getComputedStyle(ref.current)['marginRight']
            const marginRightNumber = Number(marginRight.slice(0, marginRight.length - 2))
            const isInsideParent = child.left + child.width +  marginRightNumber + chipWithDotsWidth <= parentRect.right;

            if (!isInsideParent) {
                setExtraElIndex((i: number) => (i < 0 ? extraElIndex : i));
            }
        }
    }, [parentRect, extraElIndex, setExtraElIndex]);

    return (
        <div ref={ref} className={`chip ${activeChipIndex === extraElIndex ? 'active' : ''}`} onClick={() => {
            if (activeChipIndex === extraElIndex) {
                setActiveChipIndex(null)
            } else {
                setActiveChipIndex(extraElIndex)
            }
        }}>
            {title}
        </div>
    );
}