// DESIGN.MD §3: the one heading on the site (Contact card) with a word set in italic serif.
export function Accent({ text, word }: { text: string; word: string }) {
  const i = text.indexOf(word);
  if (i < 0) return text;

  return (
    <>
      {text.slice(0, i)}
      <span className="font-serif font-normal italic">{word}</span>
      {text.slice(i + word.length)}
    </>
  );
}
