# Hildegard von Bingen Clinical Trial

Tools for better display of an ongoing N=1 natural medicine clinical trial's results:
- treatment periods (work in progress),
- blood markers.

Public page is at: https://myselfhimself.github.io/hildegard-von-bingen-clinical-trial (add #refresh for fresh data).

It is intended for world audience among cancer researchers and Hildegard of Bingen therapists and afficionados.

The trial has started in August 2023.

Data comes from a Google Spreadsheet.
Rows have been feed by hand and/or through a Google Forms (the patient enters there daily treatments taken).

The clinical trial follows a weekly serology measurement, crossed with windows of at least 2 weeks of unchanged protocol. This is gives a hint of which protocol works best if ever it works.
Lack of sleep and high stress are unfortunately not noted down for the periods, even though they have been occurring often during the trial. Those situations create validation decision noise, preventing to establish whether the treatments would work at all, on patients with same pathological status.

Science tags: cancer, testicle, testicular, natural medicine, chemotherapy.

## Monitored blood markers
Blood markers being monitored are:
- AFP,
- HCG,
- bHCG,
- LDH,
- FSH & LH,
- cholesterol (not measured anymore in the first quarter of 2024),
- testosterone.

## Hildegard of Bingen treatments
Treatments used and toggled within protocol time windows are:
- violet cream,
- duckweed elixir,
- yarrow (Achillea millefolium) tea,
- calf's trotter broth,
- fennel and fenugreek cream with brewer's grains cataplasm,
- bloodletting.

Other kinds of treatments:
- sport (1 hour at least),
- going to bed before midnight (before 23h, 23h30, midnight).

Not written down: eating meals containing spelt (Triticum spelta or Triticum monoccocum).

# Technical stack
- ChartJS v4
- Luxon ChartJS Adapter
- SheetDB JS client

# Tools
You may run a dumper to regenerate `sheetData.js`: `cd util; node grabLatestSheetData.js`.
You will need Node >= 21 providing a native `fetch`, otherwise `npm install node-fetch` and `require` it.
This makes new cache that ought to be committed upstream. Visiting the web page's URL with the `#refresh` hash does the same job within the browser.

# Bibliography
- [Lillie EO, Patay B, Diamant J, Issell B, Topol EJ, Schork NJ. The n-of-1 clinical trial: the ultimate strategy for individualizing medicine? Per Med. 2011 Mar;8(2):161-173. doi: 10.2217/pme.11.7. PMID: 21695041; PMCID: PMC3118090.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3118090/)
- more coming soon (on violet extract, galangal extract vs. cancer & testicles)


# Anonymity
The N=1 patient identity is undisclosed.
For more data, or any question, please create a Github issue or contact the developer.

# License
CC0 License - similar to Public domain:)