from pathlib import Path

root = Path(__file__).resolve().parent.parent / 'src'
replacements = [
    ('src="assets/', 'src="/assets/'),
    ("src='assets/", "src='/assets/"),
    ('href="assets/', 'href="/assets/'),
    ("href='assets/", "href='/assets/"),
    ('url(assets/', 'url(/assets/')
]

updated_files = 0
updated_count = 0
for path in root.rglob('*'):
    if path.suffix in {'.ts', '.tsx', '.js', '.jsx'}:
        text = path.read_text(encoding='utf-8')
        new = text
        for old, new_text in replacements:
            new = new.replace(old, new_text)
        if new != text:
            path.write_text(new, encoding='utf-8')
            updated_files += 1
            updated_count += sum(text.count(old) for old, _ in replacements)

print(f'updated {updated_files} files, {updated_count} replacements')
