import { Textarea } from "@/components/ui/textarea";
import React from "react";

function EditableInput({ rows, cols, value, onChange, onBlur, className }) {
	return <>
    <Textarea rows={rows} cols={cols} value={value}  />
  </>;
}

export default EditableInput;
