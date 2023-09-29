import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import "./editor.scss";

export interface ImageInputRef {
  reset: () => void;
}

interface Props {
  editorKey: any;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const TextEditor = (props: Props) => {
  const { className, placeholder, editorKey, value, onChange } = props;
  const [editor, setEditor] = useState<EditorState>(EditorState.createEmpty());

  useEffect(() => {
    const contentBlock = value && htmlToDraft(value);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      setEditor(EditorState.createWithContent(contentState));
      handleChange(EditorState.createWithContent(contentState));
    } else {
      setEditor(EditorState.createEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  const handleChange = (editor: EditorState) => {
    try {
      const value = draftToHtml(convertToRaw(editor.getCurrentContent()));
      setEditor(editor);
      onChange(value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Editor
      key={editorKey}
      editorState={editor}
      wrapperClassName="editor-containter"
      toolbarStyle={{ borderColor: "#d2d6de" }}
      placeholder={placeholder}
      editorClassName={className}
      onEditorStateChange={handleChange}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "image",
          "remove",
          "history",
        ],
        colorPicker: {
          colors: [
            "rgb(255,255,255)",
            "rgb(0,0,0)",
            "rgb(26,130,226)",
            "rgb(97,189,109)",
            "rgb(26,188,156)",
            "rgb(84,172,210)",
            "rgb(44,130,201)",
            "rgb(147,101,184)",
            "rgb(71,85,119)",
            "rgb(204,204,204)",
            "rgb(65,168,95)",
            "rgb(0,168,133)",
            "rgb(61,142,185)",
            "rgb(41,105,176)",
            "rgb(85,57,130)",
            "rgb(40,50,78)",
            "rgb(247,218,100)",
            "rgb(251,160,38)",
            "rgb(235,107,86)",
            "rgb(226,80,65)",
            "rgb(163,143,132)",
            "rgb(239,239,239)",
            "rgb(250,197,28)",
            "rgb(243,121,52)",
            "rgb(209,72,65)",
            "rgb(184,49,47)",
            "rgb(124,112,107)",
            "rgb(209,213,216)",
          ],
        },
        fontFamily: {
          options: [
            "Source Sans Pro",
            "Arial",
            "Georgia",
            "Impact",
            "Tahoma",
            "Times New Roman",
            "Verdana",
          ],
        },
        fontSize: {
          options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 32, 36, 40, 48],
        },
      }}
    />
  );
};
