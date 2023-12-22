import os
import markdown2
import json


def change_file_extension(file_path, new_extension):
    directory, base_filename = os.path.split(file_path)
    base_filename_without_extension, _ = os.path.splitext(base_filename)
    new_file_path = os.path.join(directory, f"{base_filename_without_extension}.{new_extension}")

    return new_file_path


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

    dictout = {change_file_extension(k, "html"): v for k, v in sorted(dictout.items(), key=lambda item: item[1]['date'], reverse = True)}

    with open('blogmetadata.json', 'w') as fp:
        json.dump(dictout, fp)


if __name__ == "__main__":
    main()

