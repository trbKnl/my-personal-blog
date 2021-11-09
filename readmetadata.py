import os
import markdown2
import json

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

    with open('blogmetadata.json', 'w') as fp:
        json.dump(dictout, fp)


if __name__ == "__main__":
    main()
