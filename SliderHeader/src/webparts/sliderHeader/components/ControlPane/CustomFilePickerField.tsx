import * as React from 'react';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';

export interface ICustomFilePickerFieldProps {
  value?: string;
  onChange: (value: string) => void;
  context: any;
}

const CustomFilePickerField: React.FC<ICustomFilePickerFieldProps> = ({ value, onChange, context }) => {
  return (
    <div>
      <FilePicker
        context={context}
        accepts={[".gif", ".jpg", ".jpeg", ".bmp", ".dib", ".tif", ".tiff", ".ico", ".png", ".jxr", ".svg"]}
        buttonLabel="Seleccionar archivo"
        onSave={(filePickerResults: IFilePickerResult[]) => {
          const firstFile = filePickerResults && filePickerResults.length > 0 ? filePickerResults[0] : undefined;
          onChange(firstFile?.fileAbsoluteUrl || '');
        }}
        hideRecentTab={true}
        hideStockImages={false}
        hideWebSearchTab={false}
        hideLocalMultipleUploadTab={true}
        hideLocalUploadTab={true}
        hideOneDriveTab={true}
      />
      {value && (
        <div style={{ marginTop: 8 }}>
          <strong>Seleccionado:</strong>
          <br />
          <a href={value} target="_blank" rel="noopener noreferrer">{value.split('/').pop()}</a>
        </div>
      )}
    </div>
  );
};

export default CustomFilePickerField;