import pandas as pd
import urllib
from argparse import ArgumentParser
from http.cookiejar import CookieJar
from scrapy.selector import Selector
from tqdm import tqdm
from joblib import Parallel, delayed
import multiprocessing
import time


def get_citations_for_page(url, buf, artid):
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
    buf.append(artid+':::'+'|'.join(citations) + u'\r\n')
    return citations


def citations(dataset_name, cit_dump_name, start, finish):
    articles = pd.read_csv(dataset_name)
    citation_ids = articles['citationID'].values
    artids = articles['scopusID'].values
    num_cores = 4
    with open(cit_dump_name, 'w') as citations:
        batch = num_cores * 4
        for j in range(start, finish, batch):
            buf = []
            Parallel(n_jobs=num_cores, backend="threading")(
                delayed(get_citations_for_page)(citation_ids[i], buf, artids[i]) for i in range(j, j + batch))
            citations.write(''.join(buf))
            time.sleep(0.5)
            print(j)
