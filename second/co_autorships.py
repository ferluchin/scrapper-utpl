from elsapy.elsclient import ElsClient
from elsapy.elsdoc import FullDoc, AbsDoc
from tqdm import tqdm
import json
import pandas as pd

# Load configuration
# con_file = open("config.json")
# config = json.load(con_file)
# con_file.close()

# Initialize client


def autorships(dataset_name, aut_dump_name, apiKey):
    client = ElsClient(apiKey)
    data = pd.read_csv(dataset_name)
    ids = data['id'].values
    auth_data = {'author_ids': [], 'citation_ids': []}
    # with open(aut_dump_name, 'w') as aut:
    num = 0
    for id in tqdm(ids):
        # print(id)
        scp_doc = AbsDoc(scp_id=id.split(':')[1])
        if scp_doc.read(client):
            scp_doc.write()
        else:
            print("Read document failed.")
            auth_data['author_ids'].append('None' + u'\r\n')
            auth_data['citation_ids'].append('None' + u'\r\n')
            continue
        num += 1
        try:
            # print('bp3')
            authors_from_doc = scp_doc.data['authors']['author']
            # print('bp4')
            auth_data['author_ids'].append(
                [au['@auid'] for au in authors_from_doc])
            # print('bp5')
            # print(scp_doc.data['item']['bibrecord'])
            try:
                references = scp_doc.data['item']['bibrecord']['tail']['bibliography']['reference']
            except:
                auth_data['citation_ids'].append('None' + u'\r\n')
                continue
            # print('bp6')
            # test_l = [r['ref-info']['refd-itemidlist'] for r in references]
            # print(test_l)
            # print("---------------------")
            references_result = []
            # print('bp1')
            # if not references:
            # print('er1')
            for ref in references:
                ref_items = ref['ref-info']['refd-itemidlist']['itemid']
                # if not ref_items:
                #     print('er2')
                if isinstance(ref_items, list):
                    for ri in ref_items:
                        if ri['@idtype'] == 'SGR':
                            references_result.append(ri['$'])
                else:
                    if ref_items['@idtype'] == 'SGR':
                        references_result.append(ref_items['$'])
            # print('bp2')
            # print(references[0])
            # print(references_result)
            if references_result:
                auth_data['citation_ids'].append(references_result)
            else:
                # print("OLOLO")
                auth_data['citation_ids'].append('None' + u'\r\n')
            # aut.write(';'.join([':'.join([i['ce:indexed-name'], i['@auid']])
            #                     for i in scp_doc.data['authors']['author']]) + u'\r\n')
        except Exception as ex:
            print(ex)
            #print([r['ref-info']['refd-itemidlist'] for r in references])
            auth_data['author_ids'].append('None' + u'\r\n')
            auth_data['citation_ids'].append('None' + u'\r\n')

    auth_cit_dataset = pd.DataFrame(data=auth_data)
    auth_cit_dataset.to_csv(aut_dump_name)
