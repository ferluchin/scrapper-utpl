import json
import time
import urllib
from tqdm import tqdm


def get_page(url):
    req = urllib.request.Request(
        url, headers={'User-Agent': "Chrome/35.0.1916.47"})
    html = urllib.request.urlopen(req).read()
    return html


def make_url(subject, year, apikey, batchsize):
    url = 'https://api.elsevier.com/content/search/scopus?cursor=*&count={batchsize}' \
          '&query=date={date}&subj={subject}&apiKey={key}'.format(key=apikey,
                                                                  date=year,
                                                                  subject=subject,
                                                                  batchsize=batchsize)
    return url


def get_next_url(dump):
    dump_json = json.loads(dump)
    links = dump_json['search-results']['link']
    for link in links:
        if link['@ref'] == 'next':
            return link['@href']


def scrape(dump_name, year, subject, args):
    #year = args.year
    #subject = args.subject
    api_key = args.apikey
    batch_size = 25

    url = make_url(subject, year, api_key, batch_size)
    print(year)
    print(subject)
    # print(url)
    dump = get_page(url)
    tree = json.loads(dump)
    total_results = int(tree['search-results']['opensearch:totalResults'])
    print(total_results)

    with open(dump_name, 'wb') as dumps:
        dumps.write(dump + b'\r\n')
        for start in tqdm(range(batch_size, total_results, batch_size)):
            url_next = get_next_url(dump)
            try:
                dump = get_page(url_next)
                dumps.write(dump + b'\r\n')
                time.sleep(1)
            except Exception as ex:
                print(ex)
                break
