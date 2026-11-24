const sizes = {
  sm: "size-6 rounded text-xs",
  md: "size-7 rounded-md text-sm",
};

/** The yellow "C" square that sits beside the Cadence name. */
export function CadenceMark({ size = "md" }: { size?: keyof typeof sizes }) {
  return (
    <span
      aria-hidden
      className={`flex items-center justify-center bg-sunshine font-black text-navy ${sizes[size]}`}
    >
      C
    </span>
  );
}
