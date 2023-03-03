import pandas as pd
import urllib
from argparse import ArgumentParser
from http.cookiejar import CookieJar
from scrapy.selector import Selector
from tqdm import tqdm
import time


def get_citations_for_page(url):
    req = urllib.request.Request(
        url, headers={'User-Agent': "Chrome/35.0.1916.47"})
    cj = CookieJar()
    opener = urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(cj))
    html = opener.open(req).read()

    res = Selector(text=html).xpath('//*[@class="searchArea"]/td[1]/a/@href')
    citations = []
    for ref in res:
        cit_url = ref.get()
        citation_id = cit_url.split('eid=')[1].split('&origin')[0]
        citations.append(citation_id)
    return citations


if __name__ == '__main__':
    parser = ArgumentParser(description='Scopus citations finder')
    parser.add_argument(
        'start', help='dataset citaion parsing start', type=int)
    parser.add_argument(
        'finish', help='dataset citaion parsing finish', type=int)
    parser.add_argument('dump_name', help='citations dump file name')

    args = parser.parse_args()
    articles = pd.read_csv('/home/willstudent/AGT/articles.csv')
    citation_ids = articles['citationID'].values
    with open(args.dump_name, 'w') as citations:
        for url in tqdm(citation_ids[args.start:args.finish]):
            cits = get_citations_for_page(url)
            citations.write('|'.join(cits) + u'\r\n')
            time.sleep(0.5)
