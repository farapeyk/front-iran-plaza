import { createRoot } from 'react-dom/client';
import { RichTextEditor } from '../../src/features/content/components/rich-text-editor';

const fixtureWindow = window as typeof window & { editorDocument: unknown; editorValid: boolean };
fixtureWindow.editorValid = true;
createRoot(document.getElementById('root')!).render(<RichTextEditor
  fallbackText="متن پیش از اجزای مقاله"
  businesses={[{ id: 'business-1', name: 'مجموعه نمونه', slug: 'sample', city: 'شیراز', neighborhood: null, address: null, description: null, phone: '09121234567', logoId: null, planType: 'FREE', isCip: false }]}
  onChange={value => { fixtureWindow.editorDocument = value; }}
  onValidityChange={valid => { fixtureWindow.editorValid = valid; }}
/>);
