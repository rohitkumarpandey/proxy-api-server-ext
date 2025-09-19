import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json as jsonLang } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { linter, Diagnostic } from '@codemirror/lint';
import { LoadingService } from '../service/loading.service';
import './json-editor.scss';

interface JsonEditorProps {
  initialJson: string;
  onChange: (json: string) => void;
}

const JsonEditor = forwardRef<{ formatJson: () => boolean }, JsonEditorProps>(
  ({ initialJson, onChange }, ref) => {
    const [json, setJson] = useState<string>(initialJson);

    useEffect(() => {
      setJson(initialJson);
    }, [initialJson]);

    const handleJsonChange = (value: string) => {
      setJson(value);
      onChange(value);
    };

    const formatJson = (): boolean => {
      try {
        if (json && json.trim()) {
          const jsonObject = JSON.parse(json.trim());
          const formatted = JSON.stringify(jsonObject, null, 2);
          setJson(formatted);
          onChange(formatted);
        }
        return true;
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      formatJson,
    }));

    // ✅ Custom JSON Linter
    const jsonLinter = linter((view) => {
      const diagnostics: Diagnostic[] = [];
      try {
        JSON.parse(view.state.doc.toString());
      } catch (e: any) {
        // Error message
        diagnostics.push({
          from: 0,
          to: view.state.doc.length,
          severity: "error",
          message: e.message || "Invalid JSON",
        });
      }
      return diagnostics;
    });

    return (
      <div className="json-editor-container">
        <CodeMirror
          value={json}
          height="100%"
          width="100%"
          theme="light"
          extensions={[jsonLang(), EditorView.lineWrapping, jsonLinter]}
          onChange={(value) => {
            LoadingService.show();
            handleJsonChange(value);
            LoadingService.hide();
          }}
        />
      </div>
    );
  }
);

export default JsonEditor;