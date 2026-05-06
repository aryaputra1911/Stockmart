import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Cari...' }) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#16a34a' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2.5 text-sm rounded-xl w-64 outline-none transition-all duration-200"
        style={{
          background: '#ffffff',
          border: '1.5px solid #d1d5db',
          color: '#111827',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#16a34a';
          e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
        id="search-input"
      />
    </div>
  );
}
