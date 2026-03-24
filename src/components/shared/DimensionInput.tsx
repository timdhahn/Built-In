import { useState, useCallback, useRef, useEffect } from 'react';
import { Mm } from '@/domain/units/types';
import { useDimension } from '@/hooks/useDimension';
import styles from './DimensionInput.module.css';

interface DimensionInputProps {
  value: Mm;
  onChange: (value: Mm) => void;
  min?: Mm;
  max?: Mm;
  label?: string;
  disabled?: boolean;
}

export function DimensionInput({ value, onChange, min, max, label, disabled }: DimensionInputProps) {
  const { format, parse } = useDimension();
  const [text, setText] = useState(() => format(value));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(format(value));
      setError(null);
    }
  }, [value, format]);

  const commit = useCallback(() => {
    const parsed = parse(text);
    if (parsed === null) {
      setError('Invalid dimension');
      setText(format(value));
      return;
    }

    let clamped = parsed;
    if (min !== undefined && (clamped as number) < (min as number)) clamped = min;
    if (max !== undefined && (clamped as number) > (max as number)) clamped = max;

    setError(null);
    onChange(clamped);
    setText(format(clamped));
  }, [text, parse, format, value, onChange, min, max]);

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={inputRef}
        className={`${styles.input} ${error ? styles.error : ''}`}
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit();
            inputRef.current?.blur();
          }
        }}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
