export const RichTextPreview = ({ value }: { value: string }) => (
    <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: value || "" }} />
);
