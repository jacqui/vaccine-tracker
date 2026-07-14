"""
Pulls current outbreak records from WHO's Disease Outbreak News API.

This is a stub: it fetches and prints structured records so you can see the
real shape of the data before deciding how to map it onto `diseases` and
`outbreak_locations`. Wire up the DB write once you've eyeballed a few
real responses -- WHO's naming won't always match your disease `id` slugs,
so this is exactly the reconciliation step worth doing by hand first.
"""

import requests

WHO_DON_URL = "https://www.who.int/api/news/diseaseoutbreaknews"


def fetch_recent_outbreaks(top: int = 20) -> list[dict]:
    """Fetch the most recent Disease Outbreak News entries."""
    params = {"$orderby": "PublicationDateAndTime desc", "$top": top}
    resp = requests.get(WHO_DON_URL, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json().get("value", [])


def main():
    outbreaks = fetch_recent_outbreaks()
    for item in outbreaks:
        # Inspect real field names in the response -- WHO's schema fields
        # (title, publication date, etc.) may differ slightly from this guess.
        print(item.get("Title", "(no title)"), "-", item.get("PublicationDateAndTime"))


if __name__ == "__main__":
    main()
