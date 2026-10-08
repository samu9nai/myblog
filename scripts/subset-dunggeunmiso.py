"""학교안심 둥근미소를 세 조각(woff2)으로 나눈다.

브라우저는 화면에 쓰인 글자가 든 조각만 내려받는다. global.css의 @font-face가
조각마다 unicode-range를 걸고, 나머지 조각을 맨 앞에 선언해 마지막으로 찾게 한다.

    python3 -m venv .venv && .venv/bin/pip install fonttools brotli
    .venv/bin/python scripts/subset-dunggeunmiso.py <원본 woff2 폴더>

원본은 눈누 웹폰트 CDN(projectnoonnu/2408-5@1.0)의
HakgyoansimDunggeunmisoTTF-R.woff2, -B.woff2다.
"""

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

OUT = Path(__file__).resolve().parent.parent / 'src/assets/fonts/hakgyoansim-dunggeunmiso'

# 영문, 문장부호, 화살표, 원 문자, 한글 자모
BASIC = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x100))
    + list(range(0x2010, 0x2070))
    + list(range(0x2190, 0x2200))
    + list(range(0x2300, 0x2400))
    + list(range(0x2460, 0x2500))
    + list(range(0x3131, 0x318F))
    + [0x30FB, 0xFF5E]
)
# KS X 1001 완성형 한글 2,350자
KS = [c for c in range(0xAC00, 0xD7A4) if len(chr(c).encode('euc-kr', 'ignore')) == 2]


def save(source: Path, unicodes: list[int] | None, target: Path) -> None:
    font = TTFont(source)
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    cmap = font.getBestCmap()
    if unicodes is None:
        taken = set(BASIC) | set(KS)
        unicodes = [c for c in cmap if c not in taken]
    subsetter.populate(unicodes=[c for c in unicodes if c in cmap])
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(target)
    print(f'{target.name}: {target.stat().st_size // 1024} KB')


def main() -> None:
    source_dir = Path(sys.argv[1])
    for weight in ('R', 'B'):
        source = source_dir / f'HakgyoansimDunggeunmisoTTF-{weight}.woff2'
        save(source, BASIC, OUT / f'HakgyoansimDunggeunmiso-{weight}-basic.woff2')
        save(source, KS, OUT / f'HakgyoansimDunggeunmiso-{weight}-ks.woff2')
        save(source, None, OUT / f'HakgyoansimDunggeunmiso-{weight}-rest.woff2')


if __name__ == '__main__':
    main()
