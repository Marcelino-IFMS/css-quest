type CssEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function CssEditor({ value, onChange, placeholder }: CssEditorProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-[#3a3d35] bg-[#2B2E27]">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#20221d] text-xs text-gray-400">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
        <span className="ml-3">style.css</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full min-h-[180px] resize-y bg-transparent text-[#E8E8E3] font-mono text-sm p-4 outline-none"
      />
    </div>
  );
}
