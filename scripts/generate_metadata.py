import os
from pathlib import Path
from datetime import datetime, timezone
import json
import traceback

import markdown2
from feedgen.feed import FeedGenerator

CURRENT_DIR = Path(__file__).resolve().parent
BLOG_DIRECTORY = CURRENT_DIR / "../blogs"
RSS_DIRECTORY = CURRENT_DIR / "../rss"
BLOG_METADATA_DIRECTORY = CURRENT_DIR / ".."
FG = FeedGenerator()

# Set RSS feed metadata
FG.title('niekdeschipper.com')
FG.link(href='https://niekdeschipper.com/rss/rss.xml')
FG.description('RSS feed of niekdeschipper.com')
FG.language('en')


def to_utc_iso8601(date_str, date_format="%Y-%m-%d"):
    local_dt = datetime.strptime(date_str, date_format)
    local_dt = local_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    utc_dt = local_dt.replace(tzinfo=timezone.utc)

    return utc_dt.isoformat()


def change_file_extension(file_path, new_extension):
    directory, base_filename = os.path.split(file_path)
    base_filename_without_extension, _ = os.path.splitext(base_filename)
    new_file_path = os.path.join(directory, f"{base_filename_without_extension}.{new_extension}")

    return new_file_path


def add_rss_entry(title, blog, description, pub_date):
    """
    Add an entry to the RSS feed.
    """
    fe = FG.add_entry()
    fe.title(title)
    fe.link(href=f"https://niekdeschipper.com/projects/{blog}")
    fe.guid(f"https://niekdeschipper.com/projects/{blog}", permalink=True)
    fe.description(description)
    fe.pubDate(to_utc_iso8601(pub_date))


def generate_rss_feed():
    path = os.path.join(RSS_DIRECTORY, "rss.xml")
    FG.rss_file(path)


def main():

    try:
        dictout = {}

        for blog in os.listdir(BLOG_DIRECTORY):
            mdfile = os.path.join(BLOG_DIRECTORY, blog)
            with open(mdfile) as f:
                text = ''.join(f.readlines())
                
            # parsemarkdown
            parsedmarkdown = markdown2.markdown(text, extras=["metadata"])
            metadata = parsedmarkdown.metadata
            dictout[blog] = metadata

        # sort by time and change extension
        blogmetadata = {change_file_extension(k, "html"): v for k, v in sorted(dictout.items(), key=lambda item: item[1]['date'], reverse = True)}

        with open(BLOG_METADATA_DIRECTORY / "blogmetadata.json", 'w') as fp:
            json.dump(blogmetadata, fp)


        # Create rss feed for last 10 articles
        metadata_list = [(blog, metadata) for blog, metadata in blogmetadata.items()]
        last_10_entries = metadata_list[:10]
        for blog, metadata in last_10_entries:
            add_rss_entry(metadata["title"], blog, metadata["description"], metadata["date"])
            generate_rss_feed()

        print("meta data and rss feed created")

    except Exception as e:
        traceback.print_exc()
        print(f"No metadata and rss feed got generated: {e}")


if __name__ == "__main__":
    main()
