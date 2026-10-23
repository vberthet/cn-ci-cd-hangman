// The six body parts, drawn one per wrong guess.
const PARTS = [
  <circle key="head" cx="140" cy="70" r="18" />,
  <line key="body" x1="140" y1="88" x2="140" y2="145" />,
  <line key="left-arm" x1="140" y1="105" x2="115" y2="128" />,
  <line key="right-arm" x1="140" y1="105" x2="165" y2="128" />,
  <line key="left-leg" x1="140" y1="145" x2="118" y2="180" />,
  <line key="right-leg" x1="140" y1="145" x2="162" y2="180" />,
]

export function Gallows({ wrongGuesses }: { wrongGuesses: number }) {
  return (
    <svg
      className="gallows"
      viewBox="0 0 200 220"
      role="img"
      aria-label={`Hangman: ${wrongGuesses} wrong guesses`}
    >
      <g className="gallows-frame">
        <line x1="20" y1="210" x2="120" y2="210" />
        <line x1="50" y1="210" x2="50" y2="20" />
        <line x1="50" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="52" />
      </g>
      <g className="gallows-body" data-testid="gallows-body">
        {PARTS.slice(0, wrongGuesses)}
      </g>
    </svg>
  )
}
