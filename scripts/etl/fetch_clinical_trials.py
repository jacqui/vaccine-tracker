"""
Pulls vaccine-related clinical trials for a given disease from the
ClinicalTrials.gov v2 API.

Usage: python fetch_clinical_trials.py "Ebola"

Remember: query.cond is free-text matched, not a controlled vocabulary.
The same disease can appear under several different condition names
(e.g. "Ebola Virus Disease" vs "Bundibugyo ebolavirus disease"), so treat
this as a starting list to review by hand, not an authoritative one-shot answer.
"""

import sys

import requests

CTG_API_URL = "https://clinicaltrials.gov/api/v2/studies"


def fetch_vaccine_trials(condition: str, page_size: int = 20) -> list[dict]:
    params = {
        "query.cond": condition,
        "query.intr": "vaccine",
        "pageSize": page_size,
    }
    resp = requests.get(CTG_API_URL, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json().get("studies", [])


def summarize(study: dict) -> dict:
    protocol = study.get("protocolSection", {})
    ident = protocol.get("identificationModule", {})
    status = protocol.get("statusModule", {})
    design = protocol.get("designModule", {})
    sponsor = protocol.get("sponsorCollaboratorsModule", {})

    return {
        "nct_id": ident.get("nctId"),
        "title": ident.get("briefTitle"),
        "status": status.get("overallStatus"),
        "phase": (design.get("phases") or ["NA"])[0],
        "sponsor": sponsor.get("leadSponsor", {}).get("name"),
    }


def main():
    condition = sys.argv[1] if len(sys.argv) > 1 else "Ebola"
    studies = fetch_vaccine_trials(condition)
    print(f"Found {len(studies)} vaccine-related trials for '{condition}':\n")
    for s in studies:
        row = summarize(s)
        print(f"  {row['nct_id']}  [{row['phase']}] {row['status']}  {row['title']}")


if __name__ == "__main__":
    main()
