import {useEffect, useMemo, useRef, useState} from "react";
import type {BubbleOrderNode} from "@/Interfaces.ts";

interface InteractiveBubbleOrderProps {
    node: BubbleOrderNode;
    active: boolean;
    navigateToNode: (nodeName: string) => void;
    onContentUpdate: () => void;
}

function shuffleBubbles(bubbles: string[]) {
    const shuffled = [...bubbles];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export default function InteractiveBubbleOrder({node, active, navigateToNode, onContentUpdate}: InteractiveBubbleOrderProps) {
    const expectedOrder = useMemo(() => node.bubbles, [node.bubbles]);
    const [bubbleOrder, setBubbleOrder] = useState<string[]>([]);
    const [isSolved, setIsSolved] = useState(false);
    const dragIndexRef = useRef<number | null>(null);

    useEffect(() => {
        setIsSolved(false);
        setBubbleOrder(shuffleBubbles(node.bubbles));
    }, [node]);

    useEffect(() => {
        onContentUpdate();
    }, [bubbleOrder, isSolved]);

    function moveBubble(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
            return;
        }

        const updated = [...bubbleOrder];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);

        setBubbleOrder(updated);
        setIsSolved(updated.every((bubble, index) => bubble === expectedOrder[index]));
    }

    function onDrop(targetIndex: number) {
        if (!active || isSolved) {
            return;
        }

        const fromIndex = dragIndexRef.current;
        dragIndexRef.current = null;

        if (fromIndex == null) {
            return;
        }

        moveBubble(fromIndex, targetIndex);
    }

    return (
        <div className="journal-stream">
            <h2 className="text-[3.2vh] font-bold text-center ink-title">Message Order</h2>
            <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.2vh]"></div>

            <div className="chat-bubble fade2">{node.prompt}</div>

            <div className="w-full flex flex-col gap-[1vh] mt-[0.5vh]">
                {bubbleOrder.map((bubble, index) => (
                    <div
                        key={`${bubble}-${index}`}
                        draggable={active && !isSolved}
                        onDragStart={() => {
                            dragIndexRef.current = index;
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                        }}
                        onDrop={() => {
                            onDrop(index);
                        }}
                        className="chat-bubble fade2 w-full text-left cursor-grab active:cursor-grabbing"
                    >
                        {bubble}
                    </div>
                ))}
            </div>

            {isSolved && (
                <>
                    <div className="chat-bubble fade2">
                        <span className="text-green-700 font-semibold">Correct order!</span>
                    </div>

                    <div className="mt-[0.5vh] flex justify-end">
                        <button
                            type="button"
                            disabled={!active}
                            className="choice-btn rounded-[1vh] px-[3vh] py-[1vh] shadow-md hover:shadow-lg hover:cursor-pointer fade2 disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => navigateToNode(node.nextNode)}
                        >
                            Continue
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
