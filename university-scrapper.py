import requests
import time
import json

url = 'https://scholar.google.com/citations?view_op=view_org&hl=en&org=9715290445943318141&before_author=7pti_-EDAAAJ&astart='
start = 0
step = 100

results = {}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
while True:
    try:
        page = requests.get(url + str(start), headers=headers)
        page.raise_for_status()
        print(f"Obteniendo datos desde {start + 1} hasta {start + step}")
        authors = page.text.split('<div class="gs_ai_t">')[1:]
        for author in authors:
            try:
                name = author.split('<h3 class="gs_ai_name"><a href=')[1].split('>', 1)[1].split('</a>')[0]
                link = author.split('<h3 class="gs_ai_name"><a href="')[1].split('"')[0]
                results[name] = link
            except Exception as e:
                print(f"No se pudo procesar el autor: {e}")
        start += step
        time.sleep(5)  # Agregar un retraso de 5 segundos
    except Exception as e:
        print(f"Se produjo un error: {e}")
        break

with open('utpl.json', 'w') as outfile:
    json.dump(results, outfile, indent=2)