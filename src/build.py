import pathlib, sys, json
D = pathlib.Path(__file__).parent
src = D / 'src'
r = lambda n: (src / n).read_text()
urls = json.loads((D / 'urls.json').read_text()) if (D / 'urls.json').exists() else {}
FONTS = {
  'a': 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@300;400;500&display=swap',
  'b': 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Noto+Sans+TC:wght@300;400;500&family=Noto+Serif+TC:wght@200;300;400&family=Playfair+Display:ital,wght@0,400;1,400&display=swap',
}
TITLE = {'a': '霧嶼診所 方案A', 'b': '霧嶼診所 方案B'}
for v in ['a', 'b']:
    other = urls.get('b' if v == 'a' else 'a', '#home')
    GS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n' if v == 'b' else ''
    html = f'''<title>{TITLE[v]}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="霧嶼診所（虛構）官方網站示範：療程介紹、醫師團隊、最新消息與預約諮詢。">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS[v]}">
<style>{r('core.css')}
{r(v + '.css')}</style>
<div id="shell-top"></div>
<main id="app" class="app"></main>
<div id="shell-bottom"></div>
{GS}<script>const OTHER_URL = {json.dumps(other)};
{r('data.js')}
{r('core.js')}
{r(v + '.js')}</script>
'''
    (D / v).mkdir(exist_ok=True)
    (D / v / 'index.html').write_text(html)
    # local preview wrapper with skeleton
    (D / v / 'preview.html').write_text('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + html + '</body></html>')

# GitHub Pages bundle: full documents, relative cross-links, noindex
import re
out = D / 'pages'; out.mkdir(exist_ok=True)
for v in ['a','b']:
    other = '../b/' if v=='a' else '../a/'
    doc = (D / v / 'preview.html').read_text()
    doc = re.sub(r'const OTHER_URL = "[^"]*";', 'const OTHER_URL = "%s";' % other, doc)
    doc = doc.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex,nofollow">')
    doc = doc.replace('target="_blank" rel="noopener"', '')
    (out / v).mkdir(exist_ok=True); (out / v / 'index.html').write_text(doc)
(out / 'index.html').write_text((src / 'landing.html').read_text())
(out / '.nojekyll').write_text('')
print('built')
