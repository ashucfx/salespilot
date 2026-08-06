"""
Fix mobile responsiveness for all dashboard pages:
1. Replace hardcoded text-white/text-slate classes with semantic colors
2. Wrap all <table> elements with overflow-x-auto div if not already done
3. Fix header-level responsive gaps (sm:flex-row, etc.)
"""
import os
import re
import glob

DASHBOARD_DIR = r"frontend/src/app/(dashboard)"

def wrap_tables_with_overflow(content):
    """Wraps bare <table> tags (not already inside overflow-x-auto) with a scrollable div."""
    # Pattern: if table appears inside <div className="... overflow-x-auto ..."> skip it
    # Simple approach: find "<table" not preceded by overflow-x-auto container in last 3 lines
    lines = content.split('\n')
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line has an unwrapped <table
        if '<table ' in line or '<table>' in line:
            # Look back 3 lines to see if overflow-x-auto is already there
            prev_3 = '\n'.join(lines[max(0,i-3):i])
            if 'overflow-x-auto' not in prev_3:
                # Indent same as current line
                indent = len(line) - len(line.lstrip())
                spaces = ' ' * indent
                result.append(f'{spaces}<div className="overflow-x-auto -mx-2 sm:mx-0">')
                result.append(line)
                # Continue adding lines until closing </table>
                depth = line.count('<table') - line.count('</table>')
                i += 1
                while i < len(lines) and depth > 0:
                    l = lines[i]
                    result.append(l)
                    depth += l.count('<table') - l.count('</table>')
                    i += 1
                result.append(f'{spaces}</div>')
                continue
        result.append(line)
        i += 1
    return '\n'.join(result)


def fix_responsiveness(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix hardcoded text colors in className strings for light mode compatibility
    # These patterns target the most common issues
    content = content.replace('text-white tracking-tight', 'text-foreground tracking-tight')
    content = re.sub(r'"([^"]*?)text-white([^"]*?text-[a-z])', lambda m: '"' + m.group(1) + 'text-foreground' + m.group(2), content)
    
    # 2. Ensure tables have overflow-x-auto wrapper
    if '<table ' in content and 'overflow-x-auto' not in content:
        content = wrap_tables_with_overflow(content)
    
    # 3. Make search/filter bars responsive
    content = content.replace(
        'className="relative flex-1 min-w-[200px]"',
        'className="relative flex-1 min-w-[160px]"'
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {filepath}")
    else:
        print(f"  OK: {filepath}")


# Process all TSX files in dashboard
pattern = os.path.join(DASHBOARD_DIR, '**', 'page.tsx')
files = glob.glob(pattern, recursive=True)

print(f"Processing {len(files)} page files...")
for fp in files:
    fix_responsiveness(fp)

print("Done!")
