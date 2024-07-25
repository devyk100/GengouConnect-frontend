import { RGBColor, SketchPicker } from "react-color";
import React, { useEffect, useRef, useState } from "react";

export default function ColorPicker() {
    const [sketchPickerColor, setSketchPickerColor] = useState<RGBColor>({
        r: 241,
        g: 112,
        b: 19,
        a: 1,
    });
    const colorPickerContainerRef = useRef<HTMLDivElement>(null);
    const { r, g, b, a } = sketchPickerColor;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                colorPickerContainerRef.current &&
                !colorPickerContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="sketchpicker relative">
            <div
                className="rounded-2xl h-[30px] w-[30px] cursor-pointer"
                style={{
                    backgroundColor: `rgba(${r},${g},${b},${a})`,
                    border: "2px solid white",
                }}
                onClick={() => setIsOpen(!isOpen)}
            ></div>
            <div className="absolute z-50" ref={colorPickerContainerRef}>
                {isOpen && (
                    <SketchPicker
                        color={sketchPickerColor}
                        onChange={(color) => {
                            setSketchPickerColor(color.rgb);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
