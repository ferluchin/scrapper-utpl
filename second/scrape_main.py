from scrape_article_xmldata import scrape
from xml_parser import parse
from co_autorships import autorships
# from find_citations_MULTt import citations
from argparse import ArgumentParser


if __name__ == '__main__':
    parser = ArgumentParser(description='Scopus pages scraper')
    parser.add_argument('apikey', help='your api key')
    # parser.add_argument('startpage', help='which request page starts search', type=int)
    # parser.add_argument('finishpage', help='which request page finishes search', type=int)
    parser.add_argument('subject', help='paper subject')
    parser.add_argument('year', help='publication year')
    # parser.add_argument('dump_name', help='xml dump file name')
    # parser.add_argument('dataset_name', help='csv dataset file name')
    parser.add_argument(
        '--autorships', help='enable to extract autorships for papers', default=False, type=bool)
    parser.add_argument('--autorships_dump',
                        help='autorships for papers dump file name')
    parser.add_argument(
        '--citations', help='enable to extract citations for papers', default=False, type=bool)
    parser.add_argument('--citatons_dump',
                        help='citations for papers dump file name')
    parser.add_argument('--citations_start',
                        help='citations start point', type=int)
    parser.add_argument('--citations_finish',
                        help='citations finish point', type=int)

    args = parser.parse_args()

    #year = args.year
    #subject = args.subject

    subjects = ['AGRI', 'ARTS', 'BIOC', 'BUSI', 'CENG', 'CHEM', 'COMP', 'DECI', 'DENT', 'EART', 'ECON', 'ENER', 'ENGI',
                'ENVI', 'HEAL', 'IMMU', 'MATE', 'MATH', 'MEDI', 'NEUR', 'NURS', 'PHAR', 'PHYS', 'PSYC', 'SOCI', 'VETE',
                'MULT']

    for subject in subjects:
        for year in range(2000, 2020):
            year_str = str(year)
            dumpName = subject + '_' + year_str + '_' + 'dump'
            datasetName = subject + '_' + year_str + '_' + 'dataset'

            print('Start scraping')
            scrape(dumpName, year_str, subject, args)
            print('Scraping finished. Start parsing dump')
            parse(dumpName, datasetName)
            print('Finished parsing')

    # if args.autorships:
    #     autorships(args.dataset_name, args.autorships_dump, args.apikey)

    # if args.citations:
    #     citations(args.dataset_name, args.citations_dump, args.citations_start, args.citations_finish)
