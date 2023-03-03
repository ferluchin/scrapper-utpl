import json
import pandas as pd


def parse(dump_filename, dataset_filename):
    data = {'id': [], 'title': [], 'creator': [], 'date': [], 'pubName': [], 'volume': [], 'pageNum': [],
            'citationID': [], 'cursor': [], 'auth_ids': []}
    with open(dump_filename, 'r', encoding='utf-8', newline='') as dumps:
        for line in dumps:
            tree = json.loads(line)
            # if int(tree['search-results']['opensearch:totalResults']) > \
            #         int(tree['search-results']['opensearch:startIndex']):
            for article in tree['search-results']['entry']:
                try:
                    a = article['dc:title']
                    data['id'].append(article['dc:identifier'])
                    data['title'].append(article['dc:title'])
                except:
                    continue
                try:
                    data['cursor'].append(
                        tree['search-results']['cursor']['@next'])
                except:
                    data['cursor'].append('unknown')
                # try:
                #     data['blob'].append(json.dumps(article, separators=(',', ':')).encode('utf-8'))
                # except Exception as ex:
                #     print(ex)
                try:
                    data['creator'].append(article['dc:creator'])
                except:
                    data['creator'].append('unknown')
                try:
                    data['date'].append(article['prism:coverDate'])
                except:
                    data['date'].append('2010-01-01')
                try:
                    data['pubName'].append(article['prism:publicationName'])
                except:
                    data['pubName'].append('unknown')
                try:
                    data['volume'].append(article['prism:volume'])
                except:
                    data['volume'].append('unknown')
                try:
                    pagerange = str.replace(
                        article['prism:pageRange'], 'S', '')
                    data['pageNum'].append(int(pagerange.split('-')[1]) - int(
                        pagerange.split('-')[0]))
                except:
                    data['pageNum'].append('unknown')
                try:
                    data['auth_ids'].append([auth['authid']
                                             for auth in article['author']])
                except:
                    data['auth_ids'].append('unknown')
                data['citationID'].append(article['link'][3]['@href'])
    article_dataset = pd.DataFrame(data=data)
    article_dataset.to_csv(dataset_filename)
