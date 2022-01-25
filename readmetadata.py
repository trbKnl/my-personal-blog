import os
import markdown2
import json
import datetime

def main():
    # blog directory
    blogdirectory = "./blogs"

    dictout = {}

    for blog in os.listdir(blogdirectory):
        mdfile = os.path.join(blogdirectory, blog)
        with open(mdfile) as f:
            text = ''.join(f.readlines())
            
        # parsemarkdown
        parsedmarkdown = markdown2.markdown(text, extras=["metadata"])
        dictout[blog] = parsedmarkdown.metadata

    dictout = {k: v for k,v in sorted(dictout.items(), key=lambda item: item[1]['date'], reverse = True)}

    with open('blogmetadata.json', 'w') as fp:
        json.dump(dictout, fp)


if __name__ == "__main__":
    main()


