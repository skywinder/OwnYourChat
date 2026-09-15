interface FileCitationPillProps {
  marker: string
}

export function FileCitationPill({ marker }: FileCitationPillProps) {
  const lines = marker
    .slice(0, -1)
    .split('\uE202')
    .filter((field) => /^L\d+(?:[-–]L?\d+)?$/.test(field))
    .map((field) => field.replace(/L/g, '').replace(/[-–]/g, '–'))

  return (
    <span
      className="inline-flex items-center rounded-xl bg-accent px-2 text-xs text-muted-foreground ms-1"
      title="Reference to an uploaded file. The original file is not linked to this citation in the local archive."
    >
      {lines.length ? `File · lines ${lines.join(', ')}` : 'File reference'}
    </span>
  )
}
