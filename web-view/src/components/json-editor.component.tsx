import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import './json-editor.scss';

const JsonEditor = forwardRef<{ formatJson: () => boolean }, { initialJson: string, onChange: (json: string) => void }>(({ initialJson, onChange }, ref) => {
    const [json, setJson] = useState<string>(initialJson);
    const [lineNumbers, setLineNumbers] = useState<string[]>([]);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const lines = json.split('\n');
        setLineNumbers(lines.map((_, index) => `${index + 1}`));
    }, [json]);

    // Synchronize the height of the line numbers and textarea
    useEffect(() => {
        if (lineNumbersRef.current && textareaRef.current) {
            // Reset height to auto to allow recalculation
            textareaRef.current.style.height = 'auto';
            lineNumbersRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight; // Get the scroll height of the textarea
            lineNumbersRef.current.style.height = `${scrollHeight}px`; // Set the height of the line numbers
            textareaRef.current.style.height = `${scrollHeight}px`; // Set the height of the textarea
        }
    }, [json, lineNumbers]);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newJson = e.target.value;
        setJson(newJson);
        onChange(newJson);
    };

    const formatJson = (): boolean => {
        try {
            if (json && json.trim()) {
                const jsonObject = JSON.parse(json?.trim());
                setJson(JSON.stringify(jsonObject, null, 2));
            }
            return true;
        } catch (error) {
        }
        return false;
    };

    useImperativeHandle(ref, () => ({
        formatJson
    }));

    return (
        <div className="json-editor-container">
            <div className="line-numbers" ref={lineNumbersRef}>
                {lineNumbers.map(lineNumber => (
                    <div key={lineNumber} className="line-number">{lineNumber}</div>
                ))}
            </div>
            <textarea
                className="json-textarea"
                value={json}
                onChange={handleJsonChange}
                spellCheck="false"
                ref={textareaRef}
            />
        </div>
    );
});

export default JsonEditor;